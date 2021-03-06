export default function (content, preloadedState) {
  return `<!doctype html>
<html lang="en">
  <head>
    <title>cheapcrypto - Cheap Cryptocurrency</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Browse cheap cryptocurrency and add them to your watchlist." />
    <meta name="keywords" content="cheap cryptocurrency" />
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
    <script defer src="/js/bundle.js?v=0.1.13"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-RJ2DCZT5YN"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-RJ2DCZT5YN');
    </script>
    
  </head>
  <body>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <main>${content}</main>
  </body>
</html>`;
}
