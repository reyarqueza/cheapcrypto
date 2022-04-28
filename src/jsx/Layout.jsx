import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CoinWatchList from './CoinWatchList.jsx';
import UserAppBar from './UserAppBar.jsx';
import {UserContext} from '../context';

export default function Layout() {
  const [dismissProgress, setDismissProgress] = useState(false);

  setTimeout(() => {
    setDismissProgress(true);
  }, 1000);

  return (
    <div>
      <UserAppBar />
      <UserContext.Consumer>
        {user => {
          if (user && user.user && Object.keys(user.user).length === 0) {
            if (!dismissProgress) {
              return (
                <div className="coin-watchlist">
                  <Box m={2}>
                    <LinearProgress />
                  </Box>
                </div>
              );
            }
            return <div className="coin-watchlist"></div>;
          }
          return <CoinWatchList user={user && user.user} />;
        }}
      </UserContext.Consumer>
      <Outlet />
    </div>
  );
}
