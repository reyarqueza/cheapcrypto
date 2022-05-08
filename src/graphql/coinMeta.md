# Notes when using GraphiQL

Use the GraphiQL app on http://localhost:3000/graphql

## In the GraphiQL app, test with:

```
query CoinMeta($contractAddress: String!) {
  coinMeta(contractAddress: $contractAddress) {
    id
    name
    symbol
    category
    logo
    description
    subreddit
    notice
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
    quote {
      price
      volume_24h
      volume_change_24h
      percent_change_1h
      percent_change_24h
      percent_change_7d
      percent_change_30d
      percent_change_60d
      percent_change_90d
      market_cap
      market_cap_dominance
      fully_diluted_market_cap
      last_updated
    }
  }
}
```

## when using the GraphiQL app's QUERY VARIABLES textarea box, the map needs to be specified in JSON.

```
{ "contractAddress": "0x5fdfe5ee55ae0fb7e0dba3481ea46f22fc92cbbb"}
```
