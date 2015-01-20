var path = require('path');

module.exports = {

  dev: {
    devtool: 'source-map',
    entry: './dev/dev.jsx',
    output: {
      filename: 'bundle.js',
      path: __dirname,
      // publicPath: 'dev/'
    },
    
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader' }
      ],
      postLoaders: [
        { loader: path.join(__dirname, './jstransform-loader') }
      ]
    },
  },

  test: {
    devtool: 'source-map',
    cache: true,
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader' },
      ],
      postLoaders: [
        { loader: path.join(__dirname, './jstransform-loader') }
      ]
    },
  }
}