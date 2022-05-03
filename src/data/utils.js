export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString();
}

export function formatSmallNumber(num) {
  let firstPart;
  let secondPart;

  if (num > 1) {
    return num;
  }

  if (num.toString().indexOf('.') > -1) {
    firstPart = num.toString().split('.')[1].split('e')[0].length;
  } else {
    firstPart = num.toString().split('e')[0].length;
  }
  secondPart = num.toString().split('-')[1];

  return num.toFixed(Number(firstPart) + Number(secondPart));
}

function bigWordNumber(num, precision) {
  if (num >= 1e6 && num < 1e9) {
    // million
    return `${+(num / 1e6).toPrecision(precision)} Million`;
  } else if (num >= 1e9 && num < 1e12) {
    // billion
    return `${+(num / 1e9).toPrecision(precision)} Billion`;
  } else if (num >= 1e12 && num < 1e15) {
    // trillion
    return `${+(num / 1e12).toPrecision(precision)} Trillion`;
  } else if (num >= 1e15 && num < 1e18) {
    // quadrillion
    return `${+(num / 1e15).toPrecision(precision)} Quadrillion`;
  } else if (num >= 1e18 && num < 1e21) {
    // quntillion
    return `${+(num / 1e18).toPrecision(precision)} Quntillion`;
  } else if (num >= 1e21 && num < 1e24) {
    // sixtillion
    return `${+(num / 1e21).toPrecision(precision)} Sixtillion`;
  } else if (num >= 1e24 && num < 1e27) {
    // septillion
    return `${+(num / 1e24).toPrecision(precision)} Septillion`;
  } else if (num >= 1e27 && num < 1e30) {
    // octillion
    return `${+(num / 1e27).toPrecision(precision)} Octillion`;
  } else if (num >= 1e30 && num < 1e33) {
    // nonillion
    return `${+(num / 1e30).toPrecision(precision)} Nonillion`;
  } else {
    return num;
  }
}

function coinMarketCapNumber(num, precision) {
  return typeof num == 'number' ? bigWordNumber(num, precision) : num;
}

export function formatNumber(num, precision) {
  if (!num) {
    return '-';
  }

  if (num < 1e6) {
    return Number(num).toLocaleString();
  }

  return coinMarketCapNumber(num, precision);
}
