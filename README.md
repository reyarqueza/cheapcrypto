# isomorphic-react-starter-kit

## Server Side React, Server Side Redux and Client Side React

I created this to be used as a template. Currently, I couldn't find a cra-template that met my
needs. So I created this template with traditional webpack instead of create react app.

Its benefits are:

- SSR + CSR = Isomorphic React with ReactDOMServer and ReactDOM.hydrate
- Server Side Redux (which handles the intial redux state)
- Initially have Lighthouse 100 scores across the board (except PWA)

![Lighthouse Initial Score](https://raw.githubusercontent.com/reyarqueza/isomorphic-react-starter-kit/main/public/images/lighthouse.webp?raw=true 'Lighthouse Initial Score')

## Install and start it up!

```bash
reyarqueza@rey-mac : ~/isomorphic-react-starter-kit
$ npm install
$ npm start
```

## Development

Open up 3 terminals and run the following npm scripts:

### Run the Express server

```bash
reyarqueza@rey-mac : ~/isomorphic-react-starter-kit
$ npm start
```

### Run the javascript build watcher

```bash
reyarqueza@rey-mac : ~/isomorphic-react-starter-kit
$ npm run client-side-react-dev
```

### Run the Sass compile watcher (Dart with @use support)

```bash
reyarqueza@rey-mac : ~/isomorphic-react-starter-kit
$ npm run sass-watch
```

## Production

To create a minified production build:

```bash
reyarqueza@rey-mac : ~/isomorphic-react-starter-kit
$ npm run build
```

## The Secret (Not) Sauce

- ReactDOMServer - https://reactjs.org/docs/react-dom-server.html
- ReactDOM.hydrate - https://reactjs.org/docs/react-dom.html#hydrate
- Redux Server Rendering - https://redux.js.org/recipes/server-rendering
