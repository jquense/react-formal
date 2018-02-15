const path = require('path')
const { plugins, rules, loaders } = require('webpack-atoms')

module.exports = {
  devtool: 'source-map',
  entry: require.resolve('./App.js'),
  cache: false,
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/docs/',
  },

  resolve: {
    alias: {
      components: path.resolve(__dirname, './components'),
      react: path.resolve(__dirname, '../node_modules/react'),
    },
  },
  module: {
    rules: [
      rules.js(),
      rules.css(),
      rules.less(),
      rules.images(),
      rules.fonts(),
      {
        test: /\.md$/,
        use: [loaders.js(), path.join(__dirname, './loaders/jsx')],
      },
    ],
  },
}
