import React from 'react';
import {useParams} from 'react-router-dom';

export default function Coin() {
  const params = useParams();
  return <div>coin info {params.coinId}</div>;
}
