import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import SignIn from './SignIn.jsx';

export default function Layout() {
  return (
    <div>
      <h1>cheapcrypto.app</h1>
      <SignIn />
      <Outlet />
    </div>
  );
}
