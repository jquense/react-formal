var path = require('path')


module.exports = {
  devtool: 'source-map',
  entry: require.resolve('./App.js'),
  cache: false,
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/docs/'
  },

  resolve: {
    extensions: ['', '.js', 'json'],
    alias: {
      components: path.resolve(__dirname, './components'),
      react: path.resolve(__dirname, '../node_modules/react')
    }
  },

  module: {
    loaders: [
      { test: /\.json$/,  loader: 'json-loader' },
      { test: /\.css$/,  loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { test: /\.gif$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.md$/,  loader: 'babel-loader!' + path.join(__dirname, './loaders/jsx') }
    ]
  }
}
