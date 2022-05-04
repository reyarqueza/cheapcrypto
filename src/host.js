export function hostInside() {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  return process.env.NODE_ENV === 'production' ? 'http://localhost/' : 'http://localhost:3000';
}

export function hostOutside() {
  return process.env.NODE_ENV === 'production'
    ? 'http://147.182.199.190/'
    : 'http://localhost:3000';
}
