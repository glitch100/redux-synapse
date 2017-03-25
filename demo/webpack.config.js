const webpack = require('webpack');
const path = require('path');

const config = {
  devServer: {
    open: true, // Open in browser
    contentBase: __dirname,
  },
  entry: {
    app: __dirname + '/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Check for all js files
        use: [{
          loader: 'babel-loader',
          options: { presets: ['stage-0'] },
        }],
      },
      {
        test: /\.(sass|scss)$/, // Check for sass or scss file names
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    path: __dirname + '/stock/dist',
    filename: '[name].bundle.js',
  },
  resolve: {
    alias: {
      'redux-synapse': path.resolve(__dirname, '../src/index.js'),
    },
  },
};

module.exports = config;
