
module.exports =  {
  devtool: 'source-map',
  entry: './dev/dev.jsx',
  output: {
    filename: 'bundle.js',
    path: __dirname,
    publicPath: '/dev/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', 'json']
  },

  module: {
    loaders: [
      { test: /\.json$/,  loader: "json-loader" },
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.jsx$|\.js$/, loader: 'babel-loader',  exclude: /node_modules/ }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   "process.env": { NODE_ENV: JSON.stringify("production") }
    // })
  ]
}
