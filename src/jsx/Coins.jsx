import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link, Outlet} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MyTooltip from './MyTooltip.jsx';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString();
}

function formatSmallNumber(num) {
  let firstPart;
  let secondPart;

  if (num > 1) {
    return num;
  }

  firstPart = num.toString().split('.')[1].split('e')[0].length;
  secondPart = num.toString().split('-')[1];

  return num.toFixed(Number(firstPart) + Number(secondPart));
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
    return Number(num).toLocaleString();
  }

  return coinMarketCapNumber(num, precision);
}

function mapStateToProps(state) {
  return {
    listings: state,
  };
}

class Coins extends PureComponent {
  render() {
    const {listings} = this.props;

    const StyledTableCell = styled(TableCell)(({theme}) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));

    const StyledTableRow = styled(TableRow)(({theme}) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

    const columns = [
      {
        id: 1,
        field: 'name',
        headerName: 'Name',
      },
      {id: 2, field: 'symbol', headerName: 'Symbol'},
      {id: 3, field: 'platform', headerName: 'Platform'},
      {id: 4, field: 'numMarketPairs', headerName: 'Num Market Pairs'},
      {id: 5, field: 'dateAdded', headerName: 'Date Added'},
      {id: 6, field: 'lastUpdated', headerName: 'Last Updated'},
      {id: 7, field: 'maxSupply', headerName: 'Max Supply'},
      // {id: ,field: 'circulatingSupply', headerName: 'Circulating Supply'},
      {id: 8, field: 'cmcRank', headerName: 'CMC Rank'},
      {
        id: 9,
        field: 'selfReportedCirculatingSupply',
        headerName: 'Self Reported Circulating Supply',
      },
      {id: 10, field: 'selfReportedMarketCap', headerName: 'Self Reported Market Cap'},
      {id: 11, field: 'quote', headerName: 'Quote'},
    ];

    const rows =
      listings &&
      listings.map(prop => ({
        id: prop.id,
        tokenAddress: prop.platform.token_address,
        name: prop.name,
        symbol: prop.symbol,
        platform: prop.platform.symbol,
        numMarketPairs: prop.num_market_pairs,
        dateAdded: (
          <MyTooltip label={formatDate(prop.date_added)} title={formatTime(prop.date_added)} />
        ),
        lastUpdated: (
          <MyTooltip label={formatDate(prop.last_updated)} title={formatTime(prop.last_updated)} />
        ),
        maxSupply: (
          <MyTooltip
            label={formatNumber(prop.max_supply, 4)}
            title={Number(prop.max_supply).toLocaleString()}
          />
        ),
        // circulatingSupply: prop.circulating_supply,
        cmcRank: prop.cmc_rank,
        selfReportedCirculatingSupply: (
          <MyTooltip
            label={formatNumber(prop.self_reported_circulating_supply, 4)}
            title={Number(prop.self_reported_circulating_supply).toLocaleString()}
          />
        ),
        selfReportedMarketCap: (
          <MyTooltip
            label={formatNumber(prop.self_reported_market_cap, 4)}
            title={Number(prop.self_reported_market_cap).toLocaleString()}
          />
        ),
        quote: (
          <MyTooltip label={prop.quote.USD.price} title={formatSmallNumber(prop.quote.USD.price)} />
        ),
      }));

    return (
      <>
        <Outlet />
        <Paper sx={{width: '95%', margin: 'auto', overflow: 'hidden'}}>
          <TableContainer component={Paper} sx={{maxHeight: '75vh'}}>
            <Table stickyHeader sx={{minWidth: 650}} size="small" aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  {columns.map(column => {
                    let align = 'center';
                    if (
                      column.headerName === 'Symbol' ||
                      column.headerName === 'CMC Rank' ||
                      column.headerName === 'Quote'
                    ) {
                      align = 'right';
                    }

                    return (
                      <StyledTableCell key={column.id} align={align}>
                        {column.headerName}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <StyledTableRow
                    key={row.id}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <StyledTableCell component="th" scope="row" align="left">
                      <Button
                        color="primary"
                        align="center"
                        variant="contained"
                        component={Link}
                        to={`/token-address/${row.tokenAddress}`}
                      >
                        {row.name}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.symbol}</StyledTableCell>
                    <StyledTableCell align="center">{row.platform}</StyledTableCell>
                    <StyledTableCell align="center">{row.numMarketPairs}</StyledTableCell>
                    <StyledTableCell align="right">{row.dateAdded}</StyledTableCell>
                    <StyledTableCell align="right">{row.lastUpdated}</StyledTableCell>
                    <StyledTableCell align="center">{row.maxSupply}</StyledTableCell>
                    <StyledTableCell align="right">{row.cmcRank}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.selfReportedCirculatingSupply}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.selfReportedMarketCap}</StyledTableCell>
                    <StyledTableCell align="right">{row.quote}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </>
    );
  }
}

export default connect(mapStateToProps)(Coins);
