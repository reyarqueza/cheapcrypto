import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';

import {fetchCoinList} from './graphql/coinListResolver';
import {fetchCoinMeta} from './graphql/coinMetaResolver';

import apicache from 'apicache';
import fetch from 'cross-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';

import {join} from 'path';
import {loadFilesSync} from '@graphql-tools/load-files';
import {mergeTypeDefs} from '@graphql-tools/merge';
import {print} from 'graphql';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './jsx/Layout.jsx';
import Coins from './jsx/Coins.jsx';
import Coin from './jsx/Coin.jsx';

import wrapper from './wrapper';
import {getCoinInfo, getCoinList} from './data';

const app = express();
const cache = apicache.middleware;
const port = 3000;

const typesArray = loadFilesSync(join(__dirname, './graphql'), {extensions: ['graphqls']});
const mergedSchemas = mergeTypeDefs(typesArray);
const mergedSchemaString = print(mergedSchemas);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(mergedSchemaString),
    rootValue: {
      coinList: ({minQuote, maxQuote, start}) => fetchCoinList({minQuote, maxQuote, start}),
      coinMeta: ({contractAddress}) => fetchCoinMeta({contractAddress}),
    },
    graphiql: true,
  })
);

apicache.clear();

// React SSR
function init(req, res) {
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
              <StaticRouter>
                <Routes>
                  <Route path="/" element={<Coins />}>
                    <Route path=":coinId" element={<Coin />} />
                  </Route>
                </Routes>
              </StaticRouter>
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

// static files
app.use(express.static('public'));

// SSR
app.get(['/', '/token-address/:coinId'], cache('5 minutes'), init);

// rest api
app.get('/get-coin-list', cache('5 minutes'), (req, res) => {
  const {minQuote, maxQuote, limit, start} = req.query;

  getCoinList(minQuote, maxQuote, limit, start).then(data => {
    res.send(data);
  });
});

app.get('/get-coin-meta', cache('5 minutes'), (req, res) => {
  const {contractAddress} = req.query;

  getCoinInfo(contractAddress).then(coinInfo => {
    res.send(coinInfo);
  });
});

// start express
app.listen(port, () => {
  console.log(`Open your browser at http://localhost:${port}`);
});
