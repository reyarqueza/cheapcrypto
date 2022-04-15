import React from 'react';
import {Link, Outlet} from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <h1>Cheap Crypto Layout File</h1>
      <Outlet />
    </div>
  );
}
