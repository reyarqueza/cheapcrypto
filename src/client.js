import React, {useState, lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import reducer from './reducers';

import Layout from './jsx/Layout.jsx';
import Coins from './jsx/Coins.jsx';

const Coin = lazy(() => import('./jsx/Coin.jsx'));

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const store = createStore(reducer, preloadedState, applyMiddleware(thunk));
const queryClient = new QueryClient();

import {UserContext} from './context';

function App(props) {
  const [user, setUser] = useState({});
  const value = {user, setUser};

  return (
    <UserContext.Provider value={value}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Coins />} />
                <Route
                  path="token-address"
                  element={
                    <Suspense fallback={<>...</>}>
                      <Coin />
                    </Suspense>
                  }
                >
                  <Route
                    path=":coinId"
                    element={
                      <Suspense fallback={<>...</>}>
                        <Coin />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </UserContext.Provider>
  );
}

ReactDOM.hydrate(<App />, document.querySelector('main'));
