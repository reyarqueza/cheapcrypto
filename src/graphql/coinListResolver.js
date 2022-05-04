import fetch from 'cross-fetch';
import host from '../host';

export async function fetchCoinList({minQuote, maxQuote, start}) {
  const params = new URLSearchParams({minQuote, maxQuote, start});
  const url = `${host()}/get-coin-list?${params.toString()}`;

  try {
    const response = await fetch(url);
    const coinList = await response.json();

    return coinList;
  } catch (err) {
    console.log(err);
  }
}
