import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import {loadFile} from 'graphql-import-files';
import {fetchCoinList} from './graphql/coinListResolver';

import apicache from 'apicache';
import fetch from 'cross-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './jsx/Layout.jsx';
import Coins from './jsx/Coins.jsx';
import Coin from './jsx/Coin.jsx';

import wrapper from './wrapper';
import {getCoinInfo, getCoinList} from './data';

const app = express();
const cache = apicache.middleware;
const port = 3000;

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(loadFile('./src/graphql/coinList.graphqls')),
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
              <StaticRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route path="coins" element={<Coins />}>
                      <Route path=":coinId" element={<Coin />} />
                    </Route>
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
app.get('/', cache('5 minutes'), home);

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
