import React from 'react';
import fetch from 'cross-fetch';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';

// const {loadDocuments} = require('@graphql-tools/load');
// const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');

// import coinMetaGraphQL from '../graphql/coinMeta.graphql';
// console.log('coinMetaGraphQL', coinMetaGraphQL);
export default function Coin() {
  const params = useParams();
  //const query = fs.readFileSync('./src/graphql/coinMeta.graphql').toString();
  // const coinMetaGraphQL = loadDocuments('./src/graphql/coinMeta.graphql', {
  //   loaders: [new GraphQLFileLoader()],
  // });
  // console.log('graphql coinMetaGraphQL---', coinMetaGraphQL);
  const {status, isLoading, error, data} = useQuery('coinMeta', () =>
    fetch('http://bahamut:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `
          query CoinMeta($contractAddress: String!) {
            coinMeta(contractAddress: $contractAddress) {
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
        `,
        variables: {contractAddress: params.coinId},
      }),
    })
      .then(r => r.json())
      .then(data => data && data.data.coinMeta)
  );
  console.log('-------data---', data);
  console.log('status', status);

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred: ' + error.message;
  }

  //return <div>test data {data && data.data.coinMeta && data.data.coinMeta.name}</div>;

  const {
    id,
    name,
    symbol,
    logo,
    description,
    subreddit,
    urls,
    platform,
    date_added,
    date_launched,
    is_hidden,
    self_reported_circulating_supply,
    self_reported_market_cap,
  } = data;

  const {
    website,
    twitter,
    message_board,
    chat,
    facebook,
    explorer,
    reddit,
    technical_doc,
    source_code,
    announcement,
  } = urls;

  const {platform_id, platform_name, platform_symbol, token_address} = platform;

  return (
    <div>
      test test coin.jsx...
      <br />
      {id}
      <br />
      {name}
      <br />
      {symbol}
      <br />
      {logo}
      <br />
      {description}
      <br />
      {subreddit}
      <br />
      {website} <br />
      {twitter} <br />
      {message_board} <br />
      {chat} <br />
      {facebook} <br />
      {explorer} <br />
      {reddit} <br />
      {technical_doc} <br />
      {source_code} <br />
      {announcement} <br />
      <br />
      {date_added}
      <br />
      {date_launched}
      <br />
      {is_hidden}
      <br />
      {self_reported_circulating_supply}
      <br />
      {self_reported_market_cap}
      <br />
      {platform_id}
      <br />
      {platform_name}
      <br />
      {platform_symbol}
      <br />
      {token_address}
      <br />
    </div>
  );
}
