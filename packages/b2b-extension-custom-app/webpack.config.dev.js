const path = require('path');
const createWebpackConfigForDevelopment = require('@commercetools-frontend/mc-scripts/config/create-webpack-config-for-development');

const distPath = path.resolve(__dirname, 'dist');
const entryPoint = path.resolve(__dirname, 'src/index.js');
const sourceFolders = [path.resolve(__dirname, 'src')];

const config = createWebpackConfigForDevelopment({
  distPath,
  entryPoint,
  sourceFolders,
});

config.module.rules = config.module.rules.concat({
  test: /\.pegjs$/,
  use: [require.resolve('pegjs-loader')],
});

module.exports = config;
