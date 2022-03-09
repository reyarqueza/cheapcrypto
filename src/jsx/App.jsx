import React from 'react';
import Listing from './Listing.jsx';

export default function (props) {
  return (
    <div>
      <h1>Cheap Crypto</h1>
      <Listing {...props} />
    </div>
  );
}
