module.exports = {
  devtool: 'inline-source-map',
  cache: true,
  entry: __dirname + '/../test.js',
  module: {
    loaders: [
      { test: /\.json$/,  loader: 'json-loader' },
      { test: /\.css$/,  loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
