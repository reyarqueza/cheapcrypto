import React from 'react';
import {Outlet} from 'react-router-dom';

import CoinWatchList from './CoinWatchList.jsx';
import UserAppBar from './UserAppBar.jsx';
import {UserContext} from '../context';
import {Typography, Box} from '@mui/material';

export default function Layout() {
  return (
    <div>
      <UserAppBar />
      <UserContext.Consumer>
        {user => {
          if (user && user.user && Object.keys(user.user).length === 0) {
            return (
              <div className="coin-watchlist">
                <Box sx={{width: '70vw', margin: '5vw auto', textAlign: 'center'}}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Browse <strong>cheap cryptocurrency</strong> and <strong>add</strong> them
                    <strong> to </strong>
                    your <strong>watchlist.</strong>
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
