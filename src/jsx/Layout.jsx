import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import CoinWatchList from './CoinWatchList.jsx';
import SignIn from './SignIn.jsx';
import {UserContext} from '../context';

export default function Layout() {
  return (
    <div>
      <h1>
        <Link to="/">cheapcrypto.app</Link>
      </h1>
      <SignIn />
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
