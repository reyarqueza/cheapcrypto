import fetch from 'cross-fetch';
import {config} from './config';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';

const client = new MongoClient(process.env.MONGODB_URI_CHEAPCRYPTO);

export function getCoinList(
  minQuote,
  maxQuote,
  limit = config.coinListLimit,
  start = config.coinListStart
) {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const params = new URLSearchParams({
    sort: 'price',
    sort_dir: 'asc',
    limit,
    start,
    price_min: minQuote, // ? minQuote : 1e-23, //0.000000000000000001,
    price_max: maxQuote, // ? maxQuote : 9e-16, //0.000000000000000009,
  });
  const urlWithParams = `${url}?${params.toString()}`;

  console.log(urlWithParams);

  return new Promise((resolve, reject) => {
    fetch(urlWithParams, {
      headers: config.headers,
    })
      .then(response => response.json())
      .then(json => {
        const quotes = json.data.map(item => ({id: item.id, quote: item.quote.USD}));
        updateQuotes({quotes});
        resolve(json.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateQuotes({quotes}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const quotesCollection = database.collection('quotes');

    const result = quotes.map(async quote => {
      try {
        const result = await quotesCollection.replaceOne({id: quote.id}, quote, {upsert: true});
        return result;
      } catch (e) {
        return {error: e};
      }
    });

    return JSON.stringify(result);
  } catch (e) {
    console.log(e);
  }
}

export function getCoinInfo(contractAddress) {
  const url = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';
  const params = new URLSearchParams({
    address: contractAddress,
  });
  const urlString = `${url}?${params.toString()}`;
  console.log(urlString);

  return new Promise((resolve, reject) => {
    fetch(urlString, {
      headers: config.headers,
    })
      .then(response => response.json())
      .then(json => {
        // api wraps json blob with key of coin, so remove that wrapper
        // with Object.values
        const coinInfo = json && json.data && Object.values(json.data)[0];

        getQuote({id: coinInfo.id}).then(quote => {
          const quoteObj = quote && quote.quote;
          updateCoinInfo({coinInfo});
          resolve({...coinInfo, quote: {...quoteObj}});
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getQuote({id}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const quotes = database.collection('quotes');

    try {
      const quote = await quotes.findOne({id});
      return quote;
    } catch (e) {
      return JSON.stringify({error: e});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function updateCoinInfo({coinInfo}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const coins = database.collection('coins');

    try {
      const result = await coins.replaceOne({id: coinInfo.id}, coinInfo, {upsert: true});
      return JSON.stringify(result);
    } catch (e) {
      return JSON.stringify({error: e});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function updateVisitors({ipInfo}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const visitors = database.collection('visitors');
    //console.log('visitors', visitors);
    try {
      //console.log('ipInfo', ipInfo);
      const result = await visitors.insertOne(ipInfo);
      //console.log('result', result);
      return JSON.stringify(result);
    } catch (e) {
      return JSON.stringify({error: e});
    }
  } catch (e) {
    console.log(e);
  }
}

export function signIn({firstName, lastName, picture, id, email}) {
  const saltRounds = 10;

  async function signInResult() {
    try {
      await client.connect();

      const database = client.db('cheapcrypto');
      const users = database.collection('users');
      const user = await users.findOne({email});

      if (user) {
        const isTokenIdValid = await bcrypt.compare(id, user.id);
        const {firstName, lastName, picture, email, joinDate} = user;

        return isTokenIdValid
          ? JSON.stringify({firstName, lastName, picture, email, joinDate, id})
          : JSON.stringify({message: 'User token failed, no match.'});
      }

      if (!user) {
        // insert user
        const hashedId = await bcrypt.hash(id, saltRounds);
        const joinDate = Date.now();
        const result = await users.insertOne({
          firstName,
          lastName,
          picture,
          id: hashedId,
          email,
          joinDate,
        });

        return JSON.stringify({firstName, lastName, picture, email, joinDate, id});
      }
    } catch (e) {
      console.log(e);
    }
  }

  return signInResult().catch(console.dir);
}

export async function updateUserCollection({collectionKey, collectionValue, id, email, operation}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const coins = database.collection('coins');
    const users = database.collection('users');
    const user = await users.findOne({email});

    if (user) {
      const isTokenIdValid = await bcrypt.compare(id, user.id);

      if (isTokenIdValid) {
        let userDocument;
        let collectionIds;

        switch (operation) {
          case 'add': {
            userDocument = await users.findOneAndUpdate(
              {email},
              {$addToSet: {[collectionKey]: collectionValue}},
              {
                upsert: true,
                returnDocument: 'after',
              }
            );
            break;
          }
          case 'remove': {
            userDocument = await users.findOneAndUpdate(
              {email},
              {$pull: {[collectionKey]: collectionValue}},
              {
                upsert: true,
                returnDocument: 'after',
              }
            );
            break;
          }
          default:
            return JSON.stringify({message: 'Error, no such operation'});
        }

        collectionIds = userDocument.value[collectionKey];
        const collections = await Promise.all(
          collectionIds.map(
            async collectionId => await coins.findOne({id: collectionId}).then(result => result)
          )
        );

        return collections;
      }
    }
    return JSON.stringify({message: 'Error, no such user'});
  } catch (e) {
    console.log(e);
  }
}

export async function getUserCollection({collectionKey, id, email}) {
  try {
    await client.connect();

    const database = client.db('cheapcrypto');
    const coins = database.collection('coins');
    const users = database.collection('users');
    const user = await users.findOne({email});

    if (user) {
      const isTokenIdValid = await bcrypt.compare(id, user.id);

      if (isTokenIdValid) {
        const document = await users.findOne({email});

        if (!document[collectionKey]) {
          return JSON.stringify([]);
        }

        const collectionIds = document[collectionKey];
        const collections = await Promise.all(
          collectionIds.map(
            async collectionId => await coins.findOne({id: collectionId}).then(result => result)
          )
        );

        return collections;
      }
    }
    return JSON.stringify({message: 'Error, no such user'});
  } catch (e) {
    console.log(e);
  }
}
