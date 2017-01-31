const webpack = require('webpack');
const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'index.js'),
  build: path.join(__dirname, 'build'),
};

const loaders = [
  {
    loader: 'babel',
    exclude: /node_modules/
  },
];


module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    loaders,
  },
  plugins: [

  ],
  resolve: {
    alias: {
      'redux-synapse': path.resolve(__dirname, '../src/index.js'),
    },
  },
};
