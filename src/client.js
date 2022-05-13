import React, {useState, lazy, Suspense} from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import reducer from './reducers';
import Layout from './jsx/Layout.jsx';
import Coins from './jsx/Coins.jsx';
import {UserContext, ThemeContext} from './context';

const Coin = lazy(() => import('./jsx/Coin.jsx'));

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const store = createStore(reducer, preloadedState, applyMiddleware(thunk));
const queryClient = new QueryClient();

function App(props) {
  const [theme, setTheme] = useState(
    createTheme({
      palette: {
        mode: 'light',
      },
    })
  );
  const [user, setUser] = useState({});

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserContext.Provider value={{user, setUser}}>
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
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

ReactDOM.hydrate(<App />, document.querySelector('main'));
