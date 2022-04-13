import React from 'react';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString();
}

function bigWordNumber(num, precision) {
  if (num >= 1e6 && num < 1e9) {
    // million
    return `${+(num / 1e6).toPrecision(precision)}\xa0Million`;
  } else if (num >= 1e9 && num < 1e12) {
    // billion
    return `${+(num / 1e9).toPrecision(precision)}\xa0Billion`;
  } else if (num >= 1e12 && num < 1e15) {
    // trillion
    return `${+(num / 1e12).toPrecision(precision)}\xa0Trillion`;
  } else if (num >= 1e15 && num < 1e18) {
    // quadrillion
    return `${+(num / 1e15).toPrecision(precision)}\xa0Quadrillion`;
  } else if (num >= 1e18 && num < 1e21) {
    // quntillion
    return `${+(num / 1e18).toPrecision(precision)}\xa0Quntillion`;
  } else if (num >= 1e21 && num < 1e24) {
    // sextillion
    return `${+(num / 1e21).toPrecision(precision)}\xa0Sextillion`;
  } else if (num >= 1e24 && num < 1e27) {
    // septillion
    return `${+(num / 1e24).toPrecision(precision)}\xa0Septillion`;
  } else if (num >= 1e27 && num < 1e30) {
    // octillion
    return `${+(num / 1e27).toPrecision(precision)}\xa0Octillion`;
  } else if (num >= 1e30 && num < 1e33) {
    // nonillion
    return `${+(num / 1e30).toPrecision(precision)}\xa0Nonillion`;
  } else {
    return num;
  }
}

function coinMarketCapNumber(num, precision) {
  return typeof num == 'number' ? bigWordNumber(num, precision) : num;
}

function formatNumber(num, precision) {
  if (!num) {
    return '-';
  }

  if (num < 1e6) {
    return (
      <>
        {Number(num).toLocaleString()}&nbsp;
        <strong title={coinMarketCapNumber(num, precision)}>&#8858;</strong>
      </>
    );
  }

  return (
    <>
      <span>{coinMarketCapNumber(num, precision)}&nbsp;</span>
      <strong title={Number(num).toLocaleString()}>&#8858;</strong>
    </>
  );
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
            <td>
              {formatDate(prop.date_added)}&nbsp;
              <strong title={formatTime(prop.date_added)}>&#9716;</strong>
            </td>
            <td>
              {formatDate(prop.last_updated)}&nbsp;
              <strong title={formatTime(prop.last_updated)}>&#9716;</strong>
            </td>
            <td>{formatNumber(prop.max_supply, 4)}</td>
            <td>{prop.circulating_supply}</td>
            <td>{prop.cmc_rank}</td>
            <td>{formatNumber(prop.self_reported_circulating_supply, 4)}</td>
            <td>{formatNumber(prop.self_reported_market_cap, 4)}</td>
            <td>
              <span style={{whiteSpace: 'nowrap'}}>{prop.quote.USD.price}</span>
            </td>
          </tr>
        );
      })}
    </table>
  );
}
