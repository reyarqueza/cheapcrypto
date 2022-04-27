import React from 'react';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {print} from 'graphql';
import {request, gql} from 'graphql-request';
import AddRemove from './AddRemove.jsx';

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
      <AddRemove collectionKey={'coins'} collectionValue={id} />
      <hr />
      <br />
      {id}
      <br />
      {name}
      <br />
      {symbol}
      <br />
      <img src={logo} />
      <br />
      {description}
      <br />
      {subreddit}
      <br />
      <a href={website} target="_blank">
        {website}
      </a>
      <br />
      <a href={twitter} target="_blank">
        {twitter}
      </a>
      <br />
      <a href={message_board} target="_blank">
        {message_board}
      </a>
      <br />
      <a href={chat} target="_blank">
        {chat}
      </a>
      <br />
      <a href={facebook} target="_blank">
        {facebook}
      </a>
      <br />
      <a href={explorer} target="_blank">
        {explorer}
      </a>
      <br />
      <a href={reddit} target="_blank">
        {reddit}
      </a>
      <br />
      <a href={technical_doc} target="_blank">
        {technical_doc}
      </a>
      <br />
      <a href={source_code} target="_blank">
        {source_code}
      </a>
      <br />
      <a href={announcement} target="_blank">
        {announcement}
      </a>
      <br />
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
