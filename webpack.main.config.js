const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  devtool: "nosources-source-map",
  plugins: [
    new webpack.EnvironmentPlugin({
      INGESTION_URL: JSON.stringify(process.env.INGESTION_URL),
      BACKEND_API_URL: JSON.stringify(process.env.BACKEND_API_URL),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, '.webpack/assets'),
        },
        {
          from: path.resolve(__dirname, 'src/preload.js'),
          to: path.resolve(__dirname, '.webpack/renderer/preload.js'),
        },
      ]
    })
  ],
  resolve: {
    alias: {
      services: path.resolve(__dirname, "./src/services"),
      constants: path.resolve(__dirname, "./src/constants"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
};
