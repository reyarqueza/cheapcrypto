import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import apicache from 'apicache';
import fetch from 'cross-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';

import AppContainer from './jsx/AppContainer.jsx';
import props from '../public/json/api.json';

import wrapper from './wrapper';

import {getCoinInfo, getCoinList} from './data';

const app = express();
const cache = apicache.middleware;
const port = 3000;

// in the GraphiQL app, test with:
/*
query CoinList($minQuote: String!, $maxQuote: String!) {
  coinList(minQuote: $minQuote, maxQuote: $maxQuote) {
    id,
    name, 
    quote {
      USD {
        price
      }
    }
  }
}

notice a subfield is required. you cannot just call coinList without a single subfield.

// query variables specified in JSON
{
  "minQuote": "1e-23",
  "maxQuote": "1e-17"
}
*/

const schema = buildSchema(`
  type Query {
    coinList(minQuote: String!, maxQuote: String!): [Coin]
  }

  type Coin {
    id: Int
    name: String
    symbol: String
    slug: String
    num_market_pairs: Int
    date_added: String
    max_supply: Int
    circulating_supply: Float
    total_supply: Float
    tags: [String]
    platform: Platform
    cmc_rank: Int
    self_reported_circulating_supply: Float
    self_reported_market_cap: Float
    last_updated: String
    quote: Quote
  }

  type Platform {
    id: Int
    name: String
    symbol: String
    slug: String
    token_address: String
  }

  type Quote {
    USD: Usd
  }

  type Usd {
    price: String
    volume_24h: Float
    volume_change_24h: Float
    percent_change_1h: Float
    percent_change_24h: Float
    percent_change_7d: Float
    percent_change_30d: Float
    percent_change_60d: Float
    percent_change_90d: Float
    market_cap: Float
    market_cap_dominance: Float
    fully_diluted_market_cap: Float
    last_updated: String
  }
`);

async function fetchCoinList({minQuote, maxQuote}) {
  const params = new URLSearchParams({minQuote, maxQuote});
  const url = `http://localhost:3000/get-coin-list?${params.toString()}`;

  try {
    const response = await fetch(url);
    const coinList = await response.json();

    return coinList;
  } catch (err) {
    console.log(err);
  }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: {
      coinList: ({minQuote, maxQuote}) => fetchCoinList({minQuote, maxQuote}),
    },
    graphiql: true,
  })
);

apicache.clear();
// const store = createStore(reducer);
// // Grab the initial state from our Redux store
// const preloadedState = store.getState();

// pages
function home(req, res) {
  const params = new URLSearchParams({
    minQuote: '1e-23',
    maxQuote: '1e-13',
  });
  const urlString = `http://localhost:3000/get-coin-list?${params.toString()}`;

  fetch(urlString)
    .then(response => response.json())
    .then(json => {
      const preloadedState = json;
      const store = createStore(reducer, preloadedState);
      const finalState = store.getState();

      res.send(
        wrapper(
          ReactDOMServer.renderToString(
            <Provider store={store}>
              <AppContainer />
            </Provider>
          ),
          finalState
        )
      );
    })
    .catch(error => {
      console.log(error);
    });
}

function api(req, res) {
  setTimeout(() => {
    res.send(props);
  }, 0); // simulate lag by increasing ms
}

// static files
app.use(express.static('public'));

// SSR
app.get('/', cache('5 minutes'), home);

// API
app.get('/api', api);

app.get('/get-coin-list', cache('5 minutes'), (req, res) => {
  const {minQuote, maxQuote, limit, start} = req.query;

  getCoinList(minQuote, maxQuote, limit, start).then(data => {
    res.send(data);
  });
});
// bug.. if set to 1440 minutes, cache gets corrupt. how to clear cache manually?
app.get('/get-coin-meta', cache('1 day'), (req, res) => {
  const {contractAddress} = req.query;

  getCoinInfo(contractAddress).then(coinInfo => {
    res.send(coinInfo);
  });
});

app.listen(port, () => {
  console.log(`Open your browser at http://localhost:${port}`);
});
