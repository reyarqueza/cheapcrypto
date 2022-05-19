import express from 'express';
import expressip from 'express-ip';
import https from 'https';
import fs from 'fs';
import compression from 'compression';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';

import {fetchCoinList} from './graphql/coinListResolver';
import {fetchCoinMeta} from './graphql/coinMetaResolver';

import apicache from 'apicache';
import fetch from 'cross-fetch';
import React, {useState} from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';

import {QueryClient, QueryClientProvider} from 'react-query';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';

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
import {
  getCoinInfo,
  getCoinList,
  signIn,
  updateUserCollection,
  getUserCollection,
  updateVisitors,
  getVisitCounts,
  getCountriesByVisitors,
} from './data';

import {UserContext, ThemeContext} from './context';
import {hostInside} from './host';

const app = express();
const cache = apicache.middleware;
const typesArray = loadFilesSync(join(__dirname, './graphql'), {extensions: ['graphqls']});
const mergedSchemas = mergeTypeDefs(typesArray);
const mergedSchemaString = print(mergedSchemas);

let httpsServer;

app.use(expressip().getIpInfoMiddleware);

app.get(['/', '/token-id/:coinId', '/visitors', '/get-coin-meta'], async (req, res, next) => {
  // transform spa api url to equivalent friendly seo url for tracking.
  const url =
    req.url.indexOf('get-coin-meta') > -1
      ? req.url.replace('/get-coin-meta?id=', '/token-id/')
      : req.url;

  await updateVisitors({
    visitor: {...req.ipInfo, url},
    syncVisitors: req.query.syncVisitors,
  });
  next();
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(mergedSchemaString),
    rootValue: {
      coinList: ({minQuote, maxQuote, start}) => fetchCoinList({minQuote, maxQuote, start}),
      coinMeta: ({id}) => fetchCoinMeta({id}),
    },
    graphiql: true,
  })
);

apicache.clear();

// React SSR
function App(props) {
  const {store} = props;
  const [theme, setTheme] = useState(
    createTheme({
      palette: {
        mode: 'light',
      },
    })
  );
  const [user, setUser] = useState({});
  const queryClient = new QueryClient();

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserContext.Provider value={{user, setUser}}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <StaticRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Coins />} />
                    <Route path="token-id" element={<Coin />}>
                      <Route path=":coinId" element={<Coin />} />
                    </Route>
                  </Route>
                </Routes>
              </StaticRouter>
            </QueryClientProvider>
          </Provider>
        </UserContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

function init(req, res) {
  const params = new URLSearchParams({
    minQuote: '1e-24',
    maxQuote: '1e-13',
  });
  const urlString = `${hostInside()}/get-coin-list?${params.toString()}`;

  fetch(urlString)
    .then(response => response.json())
    .then(json => {
      const preloadedState = json;
      const store = createStore(reducer, preloadedState);
      const finalState = store.getState();

      res.send(wrapper(ReactDOMServer.renderToString(<App store={store} />), finalState));
    })
    .catch(error => {
      console.log(error);
    });
}

// compress all responses
app.use(compression());

// static files
app.use(express.static('public'));

// SSR
app.get(['/', '/token-id/:coinId', '/visitors'], cache('5 minutes'), init);

// rest api
app.get('/get-coin-list', cache('5 minutes'), (req, res) => {
  const {minQuote, maxQuote, limit, start} = req.query;

  getCoinList(minQuote, maxQuote, limit, start).then(data => {
    res.send(data);
  });
});

app.get('/get-coin-meta', cache('5 minutes'), (req, res) => {
  const {id} = req.query;

  getCoinInfo(id).then(coinInfo => {
    res.send(coinInfo);
  });
});

app.get('/get-visit-counts', cache('5 minutes'), async (req, res) => {
  const json = await getVisitCounts();

  res.json(json);
});

app.get('/get-countries-by-visitors', cache('5 minutes'), async (req, res) => {
  res.json(await getCountriesByVisitors());
});

app.post('/signin', (req, res) => {
  async function runSignIn({firstName, lastName, picture, id, email}) {
    try {
      const result = await signIn({firstName, lastName, picture, id, email});
      res.send(result);
    } catch (e) {
      res.send(
        JSON.stringify({
          error: e,
        })
      );
    }
  }

  const {firstName, lastName, picture, id, email} = req.query;
  runSignIn({firstName, lastName, picture, id, email});
});

app.post('/update-user-collection', async (req, res) => {
  const {collectionKey, collectionValue, id, email, operation} = req.query;
  const json = await updateUserCollection({
    collectionKey,
    collectionValue: parseInt(collectionValue),
    id,
    email,
    operation,
  });

  res.send(json);
});

app.get('/get-user-collection', async (req, res) => {
  const {collectionKey, id, email} = req.query;
  const json = await getUserCollection({collectionKey, id, email});

  res.send(json);
});

// start express
const webConsole = () => {
  console.log(`Open your browser at ${hostInside()}`);
};

if (process.env.NODE_ENV === 'production') {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/cheapcrypto.app/privkey.pem', 'utf8'),
      cert: fs.readFileSync('/etc/letsencrypt/live/cheapcrypto.app/fullchain.pem', 'utf8'),
    },
    app
  );
  httpsServer.listen(443, webConsole);
} else {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  httpsServer = https.createServer(
    {
      key: fs.readFileSync(__dirname + '/../localhost/localhost.key', 'utf8'),
      cert: fs.readFileSync(__dirname + '/../localhost/localhost.pem', 'utf8'),
    },
    app
  );
  httpsServer.listen(3000, webConsole);
}
