import fetch from 'cross-fetch';

export async function fetchCoinMeta({contractAddress}) {
  const params = new URLSearchParams({contractAddress});
  const url = `http://localhost:3000/get-coin-meta?${params.toString()}`;

  try {
    const response = await fetch(url);
    const coinMeta = await response.json();

    return coinMeta;
  } catch (err) {
    console.log(err);
  }
}
