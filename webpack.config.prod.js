const webpack = require('webpack');
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

const config = {
  entry: './src/client.js',
  devtool: 'source-map',
  mode: 'production',
  output: {
    filename: './js/bundle.js',
    path: __dirname + '/public',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
      {
        test: /.graphql?$/,
        exclude: /node_modules/,
        loader: '@graphql-tools/webpack-loader',
      },
    ],
  },
  plugins: [new webpack.DefinePlugin(envKeys)],
};

module.exports = config;
