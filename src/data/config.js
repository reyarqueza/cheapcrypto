export const config = {
  headers: {
    Accept: 'application/json',
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
  },
  coinListLimit: 200,
  coinListStart: 1,
};
