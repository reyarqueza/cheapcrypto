# cheapcrypto

## Endpoint examples

### coin listing

http://localhost:3000/get-coin-list?minQuote=1e-23&maxQuote=1e-13

### coin info by contract address

http://localhost:3000/get-coin-meta-2?contractAddress=0x4a7cdafb3c1b63029b0a11e91d0a718bf635daab

## Install and start it up!

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm install
$ npm start
```

## Development

Open up 3 terminals and run the following npm scripts:

### Run the Express server

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm start
```

### Run the javascript build watcher

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm run client-side-react-dev
```

### Run the Sass compile watcher (Dart with @use support)

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm run sass-watch
```

## Production

To create a minified production build:

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm run build
```

## The Secret (Not) Sauce

- ReactDOMServer - https://reactjs.org/docs/react-dom-server.html
- ReactDOM.hydrate - https://reactjs.org/docs/react-dom.html#hydrate
- Redux Server Rendering - https://redux.js.org/recipes/server-rendering
