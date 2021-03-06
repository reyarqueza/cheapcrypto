import fetch from 'cross-fetch';
import {hostInside} from '../host';

export async function fetchCoinMeta({id}) {
  const params = new URLSearchParams({id});
  const url = `${hostInside()}/get-coin-meta?${params.toString()}`;

  try {
    const response = await fetch(url);
    const coinMeta = await response.json();

    return coinMeta;
  } catch (err) {
    console.log(err);
  }
}
