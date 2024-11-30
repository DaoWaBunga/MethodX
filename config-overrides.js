const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      "stream": false,
      "crypto": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "zlib": false,
      "fs": false,
      "net": false,
      "path": false,
      "tls": false
    }
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ];

  return config;
}; 