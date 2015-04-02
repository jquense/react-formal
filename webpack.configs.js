
var webpack = require('webpack');

var config = {
      experimental: true,
      playground: true,
      loose: ['all'],

      whitelist: [
        'es6.classes',
        'es6.modules',      //needed for something....
        'es6.blockScoping', //needed for classes
        'es6.arrowFunctions',
        'es6.properties.computed',
        'es6.properties.shorthand',
        'es6.parameters.default',
        'es6.parameters.rest',
        'es6.templateLiterals',
        'es7.objectRestSpread',
        'react'
      ]
    }

module.exports = {

  to5Config: config,

  dev: {
    devtool: 'source-map',
    entry: './dev/dev.jsx',
    output: {
      filename: 'bundle.js',
      path: __dirname
    },

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      loaders: [
        { test: /\.css$/,  loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/,
          query: config
        }
      ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            babelHelpers: "./util/helpers"
        })
    ]
  },

  test: {
    devtool: 'inline-source-map',
    cache: true,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        { test: /sinon-chai/, loader: "imports?define=>false" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/,
          query: config
        }
      ]
    },
  }
}