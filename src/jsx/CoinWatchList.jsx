import React from 'react';
import {useQuery} from 'react-query';
import {Link} from 'react-router-dom';

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
    collectionKey: 'coins',
  });

  if (Object.keys(user).length === 0) {
    return <div className="coin-watchlist"></div>;
  }

  const {isLoading, isError, data, error} = useQuery(
    'coins',
    async () => await fetch(`/get-user-collection?${params}`).then(response => response.json())
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <h3>Your crypto watchlist</h3>
      <table className="coin-watchlist">
        <tbody>
          {data &&
            data.map(item => {
              return (
                <tr key={item.id}>
                  <td>
                    <Link to={`/token-address/${item.platform.token_address}`}>
                      <img
                        style={{
                          imageRendering: 'pixelated',
                          border: '5px solid gold',
                          borderRadius: '50px',
                        }}
                        width="45"
                        src={item.logo}
                        alt="logo"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/token-address/${item.platform.token_address}`}>{item.name}</Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
