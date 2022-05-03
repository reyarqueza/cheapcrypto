import React from 'react';
import {useQuery} from 'react-query';
import {Link} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

export default function CoinWatchList(props) {
  // avoid SSR, sorry no isomorphic here.
  if (typeof process === 'object') {
    return <div className="coin-watchlist" sx={{backgroundColor: 'primary.light'}}></div>;
  }

  const {user} = props;
  const {id, email} = user;
  const params = new URLSearchParams({
    id,
    email,
    collectionKey: 'coins',
  });
  const {isLoading, isError, data, error} = useQuery(
    'coins',
    async () => await fetch(`/get-user-collection?${params}`).then(response => response.json())
  );

  if (isLoading) {
    return (
      <Card sx={{margin: '16px'}} className="coin-watchlist" variant="outlined">
        <Typography variant="h6" m={2} gutterBottom component="h6">
          My Watchlist
        </Typography>
        <Box m={2}>
          <Stack p={2} direction="row" spacing={1}>
            <LinearProgress />
          </Stack>
        </Box>
      </Card>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (data && data.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="h6" m={2} gutterBottom component="h6">
        My Watchlist
      </Typography>
      <Card sx={{margin: '16px'}} className="coin-watchlist" variant="outlined">
        <Box m={2}>
          <Stack direction="row" sx={{flexWrap: 'wrap', padding: '4px'}}>
            {data &&
              data.map(item => {
                return (
                  <Chip
                    key={item.id}
                    component={Link}
                    to={`/token-address/${item.platform.token_address}`}
                    clickable
                    avatar={<Avatar alt={item.name} src={item.logo} />}
                    label={item.name}
                    sx={{margin: '4px'}}
                    variant="outlined"
                  />
                );
              })}
          </Stack>
        </Box>
      </Card>
    </>
  );
}
