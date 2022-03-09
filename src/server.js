import express from 'express';
import apicache from 'apicache';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers';

import App from './jsx/App.jsx';
import props from '../public/json/api.json';

import wrapper from './wrapper';

import {getCoinInfo, getCoinList} from './data';

const app = express();
const cache = apicache.middleware;
const port = 3000;
const store = createStore(reducer);
// Grab the initial state from our Redux store
const preloadedState = store.getState();

// pages
function home(req, res) {
  res.send(
    wrapper(
      ReactDOMServer.renderToString(
        <Provider store={store}>
          <App />
        </Provider>
      ),
      preloadedState
    )
  );
}

function api(req, res) {
  setTimeout(() => {
    res.send(props);
  }, 0); // simulate lag by increasing ms
}

// static files
app.use(express.static('public'));

// SSR
app.get('/', home);

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
