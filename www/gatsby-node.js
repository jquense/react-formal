const path = require('path')
const webpack = require('webpack')

exports.modifyWebpackConfig = function modifyWebpackConfig({ config }) {
  // See https://github.com/FormidableLabs/react-live/issues/5
  config.plugin('ignore', () => new webpack.IgnorePlugin(/^(xor|props)$/))

  config.loader('raw-loader', {
    test: /src\/examples\//,
    loaders: ['raw-loader'],
  })

  config._config.resolve.alias = {
    'react-formal$': path.resolve(__dirname, '../lib/index.js'),
    'react-formal/lib': path.resolve(__dirname, '../lib'),
  }
}

exports.onCreatePage = ({ page }) => {
  if (page.path.startsWith('/api')) {
    page.layout = 'api'
  }
}
