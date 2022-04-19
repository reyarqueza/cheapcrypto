import React from 'react';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {print} from 'graphql';
import {request, gql} from 'graphql-request';

export default function Coin() {
  const params = useParams();
  let status, isLoading, error, data;

  // avoid SSR, sorry no isomorphic here.
  if (typeof process !== 'object') {
    const coinId = params.coinId;
    const endpoint = 'http://localhost:3000/graphql';
    const query = gql`
      ${print(require('../graphql/coinMeta.graphql'))}
    `;
    const variables = {contractAddress: coinId};

    ({status, isLoading, error, data} = useQuery(['coinMeta', coinId], () =>
      request(endpoint, query, variables).then(data => data && data.coinMeta)
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
