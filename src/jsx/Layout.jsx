import React from 'react';
import {Outlet} from 'react-router-dom';
import CoinWatchList from './CoinWatchList.jsx';
import UserAppBar from './UserAppBar.jsx';
import {UserContext} from '../context';

export default function Layout() {
  return (
    <div>
      <UserAppBar />
      <UserContext.Consumer>
        {user => {
          if (!user) {
            return <div className="coin-watchlist"></div>;
          }
          return <CoinWatchList user={user && user.user} />;
        }}
      </UserContext.Consumer>
      <Outlet />
    </div>
  );
}
