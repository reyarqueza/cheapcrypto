export default function host() {
  return process.env.NODE_ENV === 'production'
    ? 'http://147.182.199.190/'
    : 'http://localhost:3000';
}
