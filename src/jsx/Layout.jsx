import React from 'react';
import {Outlet} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import CoinWatchList from './CoinWatchList.jsx';
import UserAppBar from './UserAppBar.jsx';
import {UserContext} from '../context';

export default function Layout() {
  return (
    <div>
      <UserAppBar />
      <UserContext.Consumer>
        {user => {
          if (user && user.user && Object.keys(user.user).length === 0) {
            return (
              <div className="coin-watchlist">
                <Box sx={{width: '40vw', margin: '20px auto', textAlign: 'center'}}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    Browse <strong>cheap</strong> cryptocurrency and{' '}
                    <strong>add them to your watchlist.</strong>
                  </Typography>
                </Box>
              </div>
            );
          }
          return <CoinWatchList user={user && user.user} />;
        }}
      </UserContext.Consumer>
      <Outlet />
    </div>
  );
}
