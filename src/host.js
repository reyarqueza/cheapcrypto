export function hostInside() {
  return process.env.NODE_ENV === 'production' ? 'https://localhost' : 'https://localhost:3000';
}

export function hostOutside() {
  return process.env.NODE_ENV === 'production'
    ? 'https://cheapcrypto.app'
    : 'https://localhost:3000';
}
