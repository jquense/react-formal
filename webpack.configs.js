var path = require('path')
var webpack = require('webpack');

var loaders = [
      { test: /\.json$/,  loader: "json-loader" },
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },

      { 
        test: /\.jsx$|\.js$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/
      }
    ]

module.exports = {
  docs: {
    devtool: 'source-map',
    entry:'./docs/app.jsx',
    cache: false,
    output: {
      path: __dirname + '/docs/',
      filename: 'app.js'
    },

    resolve: {
      extensions: ['', '.js', '.jsx', 'json']
    },

    externals: {
      react: 'window.React',
      'react/addons': 'window.React',
      'babel-core/browser': 'window.babel'
    },
    module: {
      noParse: [
        path.join(__dirname, './node_modules/component-playground/node_modules/babel-core/browser.js')
      ],
      loaders: loaders.concat([
        { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
        { test: /\.md$/,  loader: 'babel-loader!' + path.join(__dirname, './docs/loaders/jsx') }
      ])
    }
    
  },

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
      loaders: loaders.concat([
        { test: /\.md$/,  loader: 'babel-loader!' + path.join(__dirname, './docs/util/md-to-jsx') }
        //{ test: /\.doc$/, loader: 'babel-loader!' + path.join(__dirname, './docs/util/metadata-loader') }
      ])
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
      loaders: loaders
    },
  }
}