import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link, Outlet} from 'react-router-dom';
import {DataGrid} from '@mui/x-data-grid';

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
    // sixtillion
    return `${+(num / 1e21).toPrecision(precision)} Sixtillion`;
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
    // return (
    //   <>
    //     {Number(num).toLocaleString()}&nbsp;
    //     <strong title={coinMarketCapNumber(num, precision)}>&#8858;</strong>
    //   </>
    // );
    return Number(num).toLocaleString();
  }

  return coinMarketCapNumber(num, precision);

  // return (
  //   <>
  //     <span>{coinMarketCapNumber(num, precision)}&nbsp;</span>
  //     <strong title={Number(num).toLocaleString()}>&#8858;</strong>
  //   </>
  // );
}

function mapStateToProps(state) {
  return {
    listings: state,
  };
}

class Coins extends PureComponent {
  render() {
    const {listings} = this.props;

    const columns = [
      {
        // field: {
        //   field: 'tokenName',
        //   field: 'tokenAddress',
        // },
        field: 'name',
        headerName: 'Name',
        // renderCell: params => (
        //   <Link to={`/token-address/${params.value.tokenAddress}`}>{params.value.tokenName}</Link>
        // ),
      },
      {field: 'symbol', headerName: 'Symbol'},
      {field: 'platform', headerName: 'Platform'},
      {field: 'numMarketPairs', headerName: 'Num Market Pairs'},
      {field: 'dateAdded', headerName: 'Date Added'},
      {field: 'lastUpdated', headerName: 'Last Updated'},
      {field: 'maxSupply', headerName: 'Max Supply'},
      // {field: 'circulatingSupply', headerName: 'Circulating Supply'},
      {field: 'cmcRank', headerName: 'CMC Rank'},
      {field: 'selfReportedCirculatingSupply', headerName: 'Self Reported Circulating Supply'},
      {field: 'selfReportedMarketCap', headerName: 'Self Reported Market Cap'},
      {field: 'quote', headerName: 'Quote'},
    ];

    const rows =
      listings &&
      listings.map(prop => ({
        id: prop.id,
        // tokenName: {
        //   tokenName: prop.name,
        //   tokenAddress: prop.platform.token_address,
        // },
        name: prop.name,
        symbol: prop.symbol,
        platform: prop.platform.symbol,
        numMarketPairs: prop.num_market_pairs,
        dateAdded: `${formatDate(prop.date_added)} ${formatTime(prop.date_added)}`,
        lastUpdated: `${formatDate(prop.last_updated)} ${formatTime(prop.last_updated)}`,
        maxSupply: `${formatNumber(prop.max_supply, 4)}`,
        // circulatingSupply: prop.circulating_supply,
        cmcRank: prop.cmc_rank,
        selfReportedCirculatingSupply: `${formatNumber(prop.self_reported_circulating_supply, 4)}`,
        selfReportedMarketCap: `${formatNumber(prop.self_reported_market_cap, 4)}`,
        quote: prop.quote.USD.price,
      }));

    return (
      <div>
        <Outlet />

        <div style={{height: 800, width: '100%'}}>
          <DataGrid rows={rows} columns={columns} pageSize={20} rowsPerPageOptions={[20]} />
        </div>
        <table border="1" cellPadding="5">
          <tbody>
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
            {listings &&
              listings.map(prop => {
                return (
                  <tr key={prop.platform.token_address}>
                    <td>
                      <Link to={`/token-address/${prop.platform.token_address}`}>{prop.name}</Link>
                    </td>
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
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Coins);
