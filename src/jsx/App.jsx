import React from 'react';

export default function (props) {
  return (
    <div>
      <h1>Cheap Crypto</h1>
      <table border="1">
        <tr>
          <th>Name</th>
          <th>Symbol</th>
          <th>Platform</th>
          <th>Quote</th>
        </tr>
        {props.listings.map(prop => {
          return (
            <tr key={prop.id}>
              <td>{prop.name}</td>
              <td>{prop.symbol}</td>
              <td>{prop.platform.symbol}</td>
              <td>{prop.quote.USD.price}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
