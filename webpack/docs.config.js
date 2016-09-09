var path = require('path')

var loaders = [
      { test: /\.json$/,  loader: 'json-loader' },
      { test: /\.css$/,  loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]

module.exports = {
  devtool: 'source-map',
  entry: './docs/App.js',
  cache: false,
  output: {
    path: path.resolve(__dirname, '../docs/'),
    filename: 'bundle.js',
    publicPath: '/docs/'
  },

  resolve: {
    extensions: ['', '.js', 'json'],
    alias: {
      components: path.resolve(__dirname, '../docs/components'),
      react: path.resolve(__dirname, '../node_modules/react')
    }
  },

  module: {
    loaders: loaders.concat([
      { test: /\.gif$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.md$/,  loader: 'babel-loader!' + path.join(__dirname, '../docs/loaders/jsx') }
    ])
  }

}
