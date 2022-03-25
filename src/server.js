import express from 'express';
import {graphqlHTTP} from 'express-graphql';

// official graphql
import {buildSchema} from 'graphql';

// 3rd party graphql
import {loadFile} from 'graphql-import-files';
// import {loadSchema} from '@graphql-tools/load';
// import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';

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
query CoinList($minQuote: String!, $maxQuote: String!, $start: Int!) {
  coinList(minQuote: $minQuote, maxQuote: $maxQuote, start: $start) {
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

async function fetchCoinList({minQuote, maxQuote, start}) {
  const params = new URLSearchParams({minQuote, maxQuote, start});
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
    schema: buildSchema(loadFile('./src/schemas/coinList.graphql')),
    rootValue: {
      coinList: ({minQuote, maxQuote, start}) => fetchCoinList({minQuote, maxQuote, start}),
    },
    graphiql: true,
  })
);

apicache.clear();

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
