import React from 'react';

export default function ({listings}) {
  return (
    <table border="1">
      <tr>
        <th>Name224</th>
        <th>Symbol</th>
        <th>Platform</th>
        <th>Quote</th>
      </tr>
      {listings.map(prop => {
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
  );
}
