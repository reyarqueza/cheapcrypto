export default function (content, preloadedState) {
  return `<!doctype html>
<html lang="en">
  <head>
    <title>Isomorphic Example Page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Isomorphic example page with React SSR and JavaScript" />
    <meta name="keywords" content="isomorphic web page, react, server side render" />
    <link rel="icon" href="/images/favicon.ico" />
    <link rel="stylesheet" media="screen" href="/css/styles.min.css" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <script defer>
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script defer src="/js/bundle.js?v=5-4-22"></script>
  </head>
  <body>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <main>${content}</main>
  </body>
</html>`;
}
