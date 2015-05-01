
var webpack = require('webpack');

module.exports = {

  dev: {
    devtool: 'source-map',
    entry: './dev/dev.jsx',
    output: {
      filename: 'bundle.js',
      path: __dirname
    },

    resolve: {
      extensions: ['', '.js', '.jsx', 'json']
    },

    module: {
      loaders: [
        { test: /\.json$/,  loader: "json-loader" },
        { test: /\.css$/,  loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        //{ test: /globalize/, loader: "imports?define=>false" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   "process.env": { NODE_ENV: JSON.stringify("production") }
      // })
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
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /sinon-chai/, loader: 'imports?define=>false' },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/
        }
      ]
    },
  }
}