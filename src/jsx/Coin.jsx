import React from 'react';
import {useParams, Link} from 'react-router-dom';
import {useQuery} from 'react-query';
import {print} from 'graphql';
import {request, gql} from 'graphql-request';
import AddRemove from './AddRemove.jsx';
import WebIcon from '@mui/icons-material/Web';
import TwitterIcon from '@mui/icons-material/Twitter';
import MessageIcon from '@mui/icons-material/Message';
import ChatIcon from '@mui/icons-material/Chat';
import FacebookIcon from '@mui/icons-material/Facebook';
import ExploreIcon from '@mui/icons-material/Explore';
import RedditIcon from '@mui/icons-material/Reddit';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MyTooltip from './MyTooltip.jsx';
import {formatNumber, formatSmallNumber, formatTime, formatDate} from '../data/utils';
import {hostOutside} from '../host';
import {
  Typography,
  Avatar,
  Stack,
  Card,
  Box,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Container,
  useMediaQuery,
} from '@mui/material';
import {tableCellClasses} from '@mui/material/TableCell';
import {styled} from '@mui/material/styles';

function alternatingRows(Row) {
  return styled(Row)(({theme}) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
}

export default function Coin() {
  const params = useParams();
  const isDesktop = useMediaQuery('(min-width:620px)');
  //const tableCellClasses = TableCell.tableCellClasses;
  const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = alternatingRows(TableRow);
  const StyledListItem = alternatingRows(ListItem);

  let status, isLoading, error, data;

  // avoid SSR, sorry no isomorphic here.
  if (typeof process !== 'object') {
    const coinId = params.coinId;
    const endpoint = `${hostOutside()}/graphql`;
    const query = gql`
      ${print(require('../graphql/coinMeta.graphql'))}
    `;
    const variables = {id: coinId};

    ({status, isLoading, error, data} = useQuery(['coinMeta', coinId], () =>
      request(endpoint, query, variables).then(data => data && data.coinMeta)
    ));
  }

  if (isLoading) {
    return (
      <Box m={2}>
        <Stack p={2} direction="row" spacing={1}>
          <LinearProgress />
        </Stack>
      </Box>
    );
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
    notice,
    subreddit,
    urls,
    platform,
    date_added,
    date_launched,
    is_hidden,
    self_reported_circulating_supply,
    self_reported_market_cap,
    quote,
  } = data;

  const {platform_id, platform_name, platform_symbol, token_address} = platform;

  const miscData = Object.entries(data)
    .map(([key, value]) => {
      if (
        !(
          key === 'urls' ||
          key === 'quote' ||
          key === 'platform' ||
          key === 'notice' ||
          key === 'description' ||
          key === 'id' ||
          key === 'is_hidden' ||
          key === 'logo' ||
          key === 'name' ||
          key === 'symbol'
        )
      ) {
        if (key.indexOf('date') > -1 && value) {
          return {[key]: <MyTooltip label={formatDate(value)} title={formatTime(value)} />};
        } else if (key.indexOf('self_reported') > -1 && value) {
          return {
            [key]: (
              <MyTooltip
                label={formatNumber(Number(value), 4)}
                title={Number(value).toLocaleString()}
              />
            ),
          };
        } else {
          return {[key]: value};
        }
      }
    })
    .filter(item => {
      const itemKey = item && Object.keys(item)[0];
      const itemValue = item && item[Object.keys(item)[0]];
      if (itemValue) {
        return item;
      }
    });

  const quoteData = Object.entries(quote)
    .map(([key, value]) => {
      if (key.indexOf('last_updated') > -1 && value) {
        return {[key]: <MyTooltip label={formatDate(value)} title={formatTime(value)} />};
      } else {
        return {
          [key]: <MyTooltip title={formatSmallNumber(Number(value), 4)} label={value} />,
        };
      }
    })
    .filter(item => {
      const itemKey = item && Object.keys(item)[0];
      const itemValue = item && item[Object.keys(item)[0]];
      if (itemValue) {
        return item;
      }
    });

  const links = Object.entries(urls).map(([key, value]) => ({
    name: [key][0],
    urls: value,
    icon: key => {
      switch (key) {
        case 'website':
          return <WebIcon />;
        case 'twitter':
          return <TwitterIcon />;
        case 'message_board':
          return <MessageIcon />;
        case 'chat':
          return <ChatIcon />;
        case 'facebook':
          return <FacebookIcon />;
        case 'explorer':
          return <ExploreIcon />;
        case 'reddit':
          return <RedditIcon />;
        case 'technical_doc':
          return <ArticleIcon />;
        case 'source_code':
          return <CodeIcon />;
        case 'announcement':
          return <AnnouncementIcon />;
      }
    },
  }));

  const platformData = Object.entries(platform).map(([key, value]) => {
    if (key === 'token_address') {
      switch (platform.symbol) {
        case 'BNB':
          return {
            [key]: `https://bscscan.com/token/${value}`,
          };
        case 'ETH':
          return {
            [key]: `https://etherscan.io/token/${value}`,
          };
        default:
          return {[key]: value};
      }
    } else {
      return {[key]: value};
    }
  });

  let backgroundColor = '#fff';

  return (
    <div style={{maxWidth: '1280px'}} className="coinInfo">
      <Stack m={2} direction="row" alignItems="center">
        <Avatar src={logo} sx={{width: '75px', height: '75px'}} />
        <Typography variant="h6" m={2} gutterBottom component="h1">
          {name} ({symbol})
        </Typography>
      </Stack>
      <Box sx={{minWidth: '220px', textAlign: 'left', paddingLeft: '20px'}}>
        <Stack direction="row" alignItems="center">
          <AddRemove collectionKey={'coins'} collectionValue={id} />
          {quote && quote.price ? (
            <>
              <Typography m={2} sx={{marginRight: '0'}}>
                <strong>QUOTE :</strong>{' '}
              </Typography>
              <MyTooltip title={formatSmallNumber(Number(quote.price), 4)} label={quote.price} />
            </>
          ) : null}
        </Stack>
      </Box>
      {notice ? (
        <Alert severity="error" sx={{marginTop: '20px', overflowX: 'scroll'}}>
          {notice}
        </Alert>
      ) : null}
      <Typography
        sx={{fontSize: '1.1rem', lineHeight: '1.8', padding: '20px'}}
        variant="body1"
        gutterBottom
      >
        {description}
      </Typography>

      <Stack direction={isDesktop ? 'row' : 'column'}>
        <Container sx={{paddingBottom: '40px'}}>
          <Typography variant="h6" gutterBottom component="h2">
            External Links
          </Typography>
          <List>
            {links.map((link, index) => {
              if (link.urls.length === 0) {
                return null;
              }

              return (
                <StyledListItem key={index}>
                  <ListItemIcon sx={{minWidth: '36px'}}>{link.icon(link.name)}</ListItemIcon>
                  <ListItemText primary={link && link.name && link.name.replaceAll('_', ' ')} />
                  {link.urls.map(url => (
                    <Button
                      key={url}
                      href={url}
                      target="_blank"
                      variant="outlined"
                      size="small"
                      sx={{margin: '0 10px 0 20px'}}
                    >
                      Open
                    </Button>
                  ))}
                </StyledListItem>
              );
            })}
          </List>
        </Container>
        <Container sx={{paddingBottom: '40px'}}>
          <Typography variant="h6" gutterBottom component="h2">
            Misc Information
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {miscData.map((item, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        <strong style={{textTransform: 'capitalize'}}>
                          {Object.keys(item)[0].replaceAll('_', ' ')}
                        </strong>
                      </StyledTableCell>
                      <StyledTableCell align="center">{item[Object.keys(item)[0]]}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Stack>

      <Stack direction={isDesktop ? 'row' : 'column'}>
        <Container sx={{paddingBottom: '40px'}}>
          <Typography variant="h6" gutterBottom component="h2">
            Quote Information
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {quoteData.map((item, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        <strong style={{textTransform: 'capitalize'}}>
                          {Object.keys(item)[0].replaceAll('_', ' ')}
                        </strong>
                      </StyledTableCell>
                      <StyledTableCell align="center">{item[Object.keys(item)[0]]}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Container sx={{paddingBottom: '40px'}}>
          <Typography variant="h6" gutterBottom component="h2">
            Platform Information
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {platformData.map((item, index) => {
                  const key = Object.keys(item)[0];
                  const value = item[key];
                  let platformLabel = '';

                  if (key === 'token_address') {
                    switch (platform.symbol) {
                      case 'BNB':
                        platformLabel = 'BscScan';
                        break;
                      case 'ETH':
                        platformLabel = 'Etherscan';
                        break;
                      default:
                        platformLabel = key.replaceAll('_', ' ');
                    }
                  } else {
                    platformLabel = key.replaceAll('_', ' ');
                  }

                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="left">
                        <strong style={{textTransform: 'capitalize'}}>
                          {key === 'token_address'
                            ? 'Blockchain Explorer'
                            : key.replaceAll('_', ' ')}
                        </strong>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {key === 'token_address' ? (
                          <Button
                            sx={{textTransform: 'none'}}
                            variant="contained"
                            target="_blank"
                            href={value}
                          >
                            {platformLabel}
                          </Button>
                        ) : (
                          value
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Stack>
    </div>
  );
}
