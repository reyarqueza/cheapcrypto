import React from 'react';
import {useQuery} from 'react-query';

export default function CoinWatchList(props) {
  // avoid SSR, sorry no isomorphic here.
  if (typeof process === 'object') {
    return <div className="coin-watchlist"></div>;
  }

  const {user} = props;
  const {id, email} = user;
  const params = new URLSearchParams({
    id,
    email,
    collectionKey: 'coinWatchList',
  });
  const {isLoading, isError, data, error} = useQuery('coinWatchList', async () => {
    return id
      ? await fetch(`/get-user-collection?${params}`).then(response => response.json())
      : null;
  });

  if (Object.keys(user).length === 0) {
    return <div className="coin-watchlist"></div>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="coin-watchlist">
      {data &&
        data.map(item => {
          return <div key={item}>{item}</div>;
        })}
    </div>
  );
}