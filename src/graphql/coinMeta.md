# Notes when using GraphiQL

Use the GraphiQL app on http://localhost:3000/graphql

## In the GraphiQL app, test with:

```
query CoinMeta($contractAddress: String!) {
  CoinMeta(contractAddress: $contractAddress) {
    id
    name
    symbol
    logo
    description
    subreddit
    urls {
      website
      twitter
      message_board
      chat
      facebook
      explorer
      reddit
      technical_doc
      source_code
      announcement
    }
    platform {
      id
      name
      symbol
      token_address
    }
    date_added
    date_launched
    is_hidden
    self_reported_circulating_supply
    self_reported_market_cap
  }
}
```

## when using the GraphiQL app's QUERY VARIABLES textarea box, the map needs to be specified in JSON.

```
{ "contractAddress": "0x5fdfe5ee55ae0fb7e0dba3481ea46f22fc92cbbb"}
```
