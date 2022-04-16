# Notes when using GraphiQL

Use the GraphiQL app on http://localhost:3000/graphql

## In the GraphiQL app, test with:

```
query CoinList($minQuote: String!, $maxQuote: String!, $start: Int!) {
  coinList(minQuote: $minQuote, maxQuote: $maxQuote, start: $start) {
    id
    name
    symbol
    slug
    platform {
      id
      name
      symbol
    }
    quote {
      USD {
        price
      }
    }
  }
}
```

## when using the GraphiQL app's QUERY VARIABLES textarea box, the map needs to be specified in JSON.

```
{ "minQuote": "1e-23", "maxQuote": "1e-17", "start": 1 }
```
