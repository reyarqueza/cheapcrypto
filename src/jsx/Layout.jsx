import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {SignInWithGoogle} from './SignInWithGoogle.jsx';

export default function Layout() {
  return (
    <div>
      <h1>cheapcrypto.app</h1>
      <SignInWithGoogle />
      <Outlet />
    </div>
  );
}
