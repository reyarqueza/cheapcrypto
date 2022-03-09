import fetch from 'cross-fetch';
import {config} from './config';

export function getCoinList(
  minQuote,
  maxQuote,
  limit = config.coinListLimit,
  start = config.coinListStart
) {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const params = new URLSearchParams({
    sort: 'price',
    sort_dir: 'asc',
    limit,
    start,
    price_min: minQuote, // ? minQuote : 1e-23, //0.000000000000000001,
    price_max: maxQuote, // ? maxQuote : 9e-16, //0.000000000000000009,
  });
  const urlWithParams = `${url}?${params.toString()}`;

  console.log(urlWithParams);

  return new Promise((resolve, reject) => {
    fetch(urlWithParams, {
      headers: config.headers,
    })
      .then(response => response.json())
      .then(json => {
        resolve(json.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getCoinInfo(contractAddress) {
  const url = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';
  const params = new URLSearchParams({
    address: contractAddress,
  });
  const urlString = `${url}?${params.toString()}`;
  console.log(urlString);

  return new Promise((resolve, reject) => {
    fetch(urlString, {
      headers: config.headers,
    })
      .then(response => response.json())
      .then(json => {
        resolve(json.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
