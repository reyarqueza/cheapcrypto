import React from 'react';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {print} from 'graphql';
import {request, gql} from 'graphql-request';
import AddRemove from './AddRemove.jsx';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import MyTooltip from './MyTooltip.jsx';
import {formatNumber, formatSmallNumber, formatTime, formatDate} from '../data/utils';
import {hostOutside} from '../host';

export default function Coin() {
  const params = useParams();
  let status, isLoading, error, data;

  // avoid SSR, sorry no isomorphic here.
  if (typeof process !== 'object') {
    const coinId = params.coinId;
    const endpoint = `${hostOutside()}/graphql`;
    const query = gql`
      ${print(require('../graphql/coinMeta.graphql'))}
    `;
    const variables = {contractAddress: coinId};

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
  } = data;

  const {platform_id, platform_name, platform_symbol, token_address} = platform;

  const miscData = Object.entries(data)
    .map(([key, value]) => {
      if (
        !(
          key === 'urls' ||
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

  return (
    <div style={{maxWidth: '1280px'}} className="coinInfo">
      <Stack m={2} direction="row" alignItems="center">
        <Avatar src={logo} sx={{width: '75px', height: '75px'}} />
        <Typography variant="h2" m={2} gutterBottom component="h1">
          {name} ({symbol})
        </Typography>
      </Stack>
      {notice ? <Alert severity="error">{notice}</Alert> : null}
      <Stack direction="row" sx={{padding: '20px'}}>
        <Paper>
          <Box sx={{padding: '16px', minWidth: '220px'}}>
            <AddRemove collectionKey={'coins'} collectionValue={id} />
          </Box>
          <List>
            {links.map((link, index) => {
              if (link.urls.length === 0) {
                return null;
              }

              return (
                <ListItem key={index}>
                  <ListItemIcon>{link.icon(link.name)}</ListItemIcon>
                  <ListItemText primary={link && link.name && link.name.replaceAll('_', ' ')} />
                  {link.urls.map(url => (
                    <Button
                      key={url}
                      href={url}
                      target="_blank"
                      sx={{margin: '0 10px'}}
                      variant="outlined"
                      size="small"
                    >
                      Open
                    </Button>
                  ))}
                </ListItem>
              );
            })}
          </List>
        </Paper>

        <Typography
          sx={{fontSize: '1.1rem', lineHeight: '1.8', padding: '0 20px 20px 20px'}}
          variant="body1"
          gutterBottom
        >
          {description}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {miscData.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="left">
                      <strong style={{textTransform: 'capitalize'}}>
                        {Object.keys(item)[0].replaceAll('_', ' ')}
                      </strong>
                    </TableCell>
                    <TableCell align="left">{item[Object.keys(item)[0]]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </div>
  );
}
