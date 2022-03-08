import prettier from 'prettier';

export default function (content, preloadedState) {
  return prettier.format(
    `<!doctype html>
<html lang="en">
  <head>
    <title>Isomorphic Example Page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Isomorphic example page with React SSR and JavaScript" />
    <meta name="keywords" content="isomorphic web page, react, server side render" />
    <link rel="icon" href="/images/favicon.ico" />
    <link rel="stylesheet" media="screen" href="/css/styles.min.css" />
    <script defer>
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script defer src="/js/bundle.js"></script>
  </head>
  <body>
    <main>${content}</main>
  </body>
</html>`,
    {
      parser: 'html',
    }
  );
}
