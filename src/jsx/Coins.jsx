import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link, Outlet} from 'react-router-dom';
import {tableCellClasses} from '@mui/material/TableCell';
import MyTooltip from './MyTooltip.jsx';
import {formatNumber, formatSmallNumber, formatTime, formatDate} from '../data/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Stack,
  Alert,
} from '@mui/material';

import {styled} from '@mui/material/styles';

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
      {id: 3, field: 'quote', headerName: 'Quote'},
      {id: 4, field: 'platform', headerName: 'Platform'},
      {id: 5, field: 'maxSupply', headerName: 'Max Supply'},
      {
        id: 6,
        field: 'selfReportedCirculatingSupply',
        headerName: 'Self Reported Circulating Supply',
      },
      {id: 7, field: 'selfReportedMarketCap', headerName: 'Self Reported Market Cap'},
      {id: 8, field: 'cmcRank', headerName: 'CMC Rank'},
      {id: 9, field: 'numMarketPairs', headerName: 'Num Market Pairs'},
      {id: 10, field: 'dateAdded', headerName: 'Date Added'},
      {id: 11, field: 'lastUpdated', headerName: 'Last Updated'},
      // {id: ,field: 'circulatingSupply', headerName: 'Circulating Supply'},
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

        <Alert severity="info" icon={false} sx={{padding: '0 0 0 32px'}}>
          <Typography component="h2">
            <Stack direction="row" alignItems="center">
              <strong style={{fontSize: '0.875rem', lineHeight: '1.75'}}>QUOTES FROM </strong>
              <MyTooltip sx={{display: 'inline'}} label={1e-24} title={formatSmallNumber(1e-24)} />
              <strong style={{fontSize: '0.875rem', lineHeight: '1.75'}}>TO</strong>
              <MyTooltip label={1e-14} title={formatSmallNumber(1e-14)} />
            </Stack>
          </Typography>
        </Alert>

        <Paper sx={{margin: '16px', overflow: 'hidden'}}>
          <TableContainer component={Paper} sx={{maxHeight: '65vh'}}>
            <Table stickyHeader sx={{minWidth: 1880}} size="small" aria-label="simple table">
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
                    <StyledTableCell align="right">{row.quote}</StyledTableCell>
                    <StyledTableCell align="center">{row.platform}</StyledTableCell>
                    <StyledTableCell align="center">{row.maxSupply}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.selfReportedCirculatingSupply}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.selfReportedMarketCap}</StyledTableCell>
                    <StyledTableCell align="right">{row.cmcRank}</StyledTableCell>
                    <StyledTableCell align="center">{row.numMarketPairs}</StyledTableCell>
                    <StyledTableCell align="right">{row.dateAdded}</StyledTableCell>
                    <StyledTableCell align="right">{row.lastUpdated}</StyledTableCell>
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
