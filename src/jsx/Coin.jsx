import React from 'react';
import fetch from 'cross-fetch';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {print} from 'graphql';

let coinMetaGraphQL;

export default function Coin() {
  const params = useParams();
  let status, isLoading, error, data;

  // avoid SSR, sorry no isomorphic here.
  if (typeof process !== 'object') {
    coinMetaGraphQL = require('../graphql/coinMeta.graphql');

    ({status, isLoading, error, data} = useQuery(['coinMeta', params.coinId], () =>
      fetch('http://bahamut:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: print(coinMetaGraphQL),
          variables: {contractAddress: params.coinId},
        }),
      })
        .then(r => r.json())
        .then(data => data && data.data.coinMeta)
    ));
  }

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred: ' + error.message;
  }

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
