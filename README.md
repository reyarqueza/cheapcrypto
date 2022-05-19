# cheapcrypto

## Endpoint examples

### coin listing

http://localhost:3000/get-coin-list?minQuote=1e-23&maxQuote=1e-13

### coin info by contract address

http://localhost:3000/get-coin-meta?id=17235

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
$ npm run dev
```

### Run the Sass compile watcher (Dart with @use support)

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm run sass-watch
```

## Bundle Analyzer

1. build the stats.json file

```bash
npx webpack --config ./webpack.config.prod.js --json > stats.json
```

2. run the analyzer server

```bash
npx webpack-bundle-analyzer stats.json
```

3. Webpack Bundle Analyzer is started at http://127.0.0.1:8888

## Production

To create a minified production build:

```bash
reyarqueza@rey-mac : ~/cheapcrypto
$ npm run build
```

### Gotchas in Prod the cap solution

- https://stackoverflow.com/questions/60372618/nodejs-listen-eacces-permission-denied-0-0-0-080

## The Secret (Not) Sauce

- ReactDOMServer - https://reactjs.org/docs/react-dom-server.html
- ReactDOM.hydrate - https://reactjs.org/docs/react-dom.html#hydrate
- Redux Server Rendering - https://redux.js.org/recipes/server-rendering
