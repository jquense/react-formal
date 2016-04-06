var path = require('path');

var loaders = [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/,  loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]

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
    }
  }
}
