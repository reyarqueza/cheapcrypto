import fetch from 'cross-fetch';
import {hostInside} from '../host';

export async function fetchCoinList({minQuote, maxQuote, start}) {
  const params = new URLSearchParams({minQuote, maxQuote, start});
  const url = `${hostInside()}/get-coin-list?${params.toString()}`;

  try {
    const response = await fetch(url);
    const coinList = await response.json();

    return coinList;
  } catch (err) {
    console.log(err);
  }
}
