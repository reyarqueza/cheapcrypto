import React from 'react';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function bigWordNumber(num, precision) {
  if (num >= 1e6 && num < 1e9) {
    // million
    return `${+(num / 1e6).toPrecision(precision)} Million`;
  } else if (num >= 1e9 && num < 1e12) {
    // billion
    return `${+(num / 1e9).toPrecision(precision)} Billion`;
  } else if (num >= 1e12 && num < 1e15) {
    // trillion
    return `${+(num / 1e12).toPrecision(precision)} Trillion`;
  } else if (num >= 1e15 && num < 1e18) {
    // quadrillion
    return `${+(num / 1e15).toPrecision(precision)} Quadrillion`;
  } else if (num >= 1e18 && num < 1e21) {
    // quntillion
    return `${+(num / 1e18).toPrecision(precision)} Quntillion`;
  } else if (num >= 1e21 && num < 1e24) {
    // sextillion
    return `${+(num / 1e21).toPrecision(precision)} Sextillion`;
  } else if (num >= 1e24 && num < 1e27) {
    // septillion
    return `${+(num / 1e24).toPrecision(precision)} Septillion`;
  } else if (num >= 1e27 && num < 1e30) {
    // octillion
    return `${+(num / 1e27).toPrecision(precision)} Octillion`;
  } else if (num >= 1e30 && num < 1e33) {
    // nonillion
    return `${+(num / 1e30).toPrecision(precision)} Nonillion`;
  } else {
    return 'out of range';
  }
}

export default function ({listings}) {
  return (
    <table border="1" cellPadding="5">
      <tr>
        <th>Name</th>
        <th>Symbol</th>
        <th>Platform</th>
        <th>Num Market Pairs</th>
        <th>Date Added</th>
        <th>Last Updated</th>
        <th>Max Supply</th>
        <th>Circulating Supply</th>
        <th>CMC Rank</th>
        <th>Self Reported Circulating Supply</th>
        <th>Self Reported Market Cap</th>
        <th>Quote</th>
      </tr>
      {listings.map(prop => {
        return (
          <tr key={prop.id}>
            <td>{prop.name}</td>
            <td>{prop.symbol}</td>
            <td>{prop.platform.symbol}</td>
            <td>{prop.num_market_pairs}</td>
            <td>{formatDate(prop.date_added)}</td>
            <td>{formatDate(prop.last_updated)}</td>
            <td>
              {typeof prop.max_supply === 'number'
                ? bigWordNumber(prop.max_supply, 4)
                : prop.max_supply}
              <br />
              {Number(prop.max_supply).toLocaleString()}
            </td>
            <td>{prop.circulating_supply}</td>
            <td>{prop.cmc_rank}</td>
            <td>
              {typeof prop.self_reported_circulating_supply === 'number'
                ? bigWordNumber(prop.self_reported_circulating_supply, 4)
                : prop.self_reported_circulating_supply}
              <br />
              {Number(prop.self_reported_circulating_supply).toLocaleString()}
            </td>
            <td>
              {typeof prop.self_reported_market_cap == 'number'
                ? bigWordNumber(prop.self_reported_market_cap, 4)
                : prop.self_reported_market_cap}
              <br />
              {Number(prop.self_reported_market_cap).toLocaleString()}
            </td>
            <td>{prop.quote.USD.price}</td>
          </tr>
        );
      })}
    </table>
  );
}
