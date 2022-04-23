import fetch from 'cross-fetch';
import {config} from './config';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';

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
        resolve(json.data);
      })
      .catch(error => {
        reject(error);
      });
  });
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
        resolve(json && json.data && Object.values(json.data)[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function signIn({firstName, lastName, picture, id, email}) {
  const client = new MongoClient(process.env.MONGODB_URI_CHEAPCRYPTO);
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
          ? JSON.stringify({firstName, lastName, picture, email, joinDate})
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

        return JSON.stringify({firstName, lastName, picture, email, joinDate});
      }
    } finally {
      await client.close();
    }
  }

  return signInResult().catch(console.dir);
}

export function addToUserCollection({collectionKey, collectionValue, id, email}) {
  const client = new MongoClient(process.env.MONGODB_URI_CHEAPCRYPTO);

  async function addToUserCollectionResult() {
    try {
      await client.connect();

      const database = client.db('cheapcrypto');
      const users = database.collection('users');
      const user = await users.findOne({email});

      if (user) {
        const isTokenIdValid = await bcrypt.compare(id, user.id);

        if (isTokenIdValid) {
          const document = await users.findOneAndUpdate(
            {email},
            {$push: {[collectionKey]: collectionValue}},
            {
              upsert: true,
              returnDocument: 'after',
            }
          );
          return document.value[collectionKey];
        }
      }
      return JSON.stringify({message: 'Error, no such user'});
    } finally {
      await client.close();
    }
  }

  return addToUserCollectionResult().catch(console.dir);
}
