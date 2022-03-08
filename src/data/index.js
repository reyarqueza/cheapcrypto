import fetch from 'cross-fetch';

export function getCoinList(minQuote, maxQuote) {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const params = new URLSearchParams({
    sort: 'price',
    sort_dir: 'asc',
    limit: 5000,
    price_min: minQuote, // ? minQuote : 1e-23, //0.000000000000000001,
    price_max: maxQuote, // ? maxQuote : 9e-16, //0.000000000000000009,
  });
  const urlWithParams = `${url}?${params.toString()}`;

  return new Promise((resolve, reject) => {
    fetch(urlWithParams, {
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
      },
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
