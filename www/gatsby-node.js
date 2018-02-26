const path = require('path')

exports.modifyWebpackConfig = function modifyWebpackConfig({
  plugins,
  loaders,
  actions,
}) {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /src\/examples\//,
          use: [loaders.raw()],
        },
      ],
    },
    resolve: {
      symlinks: false,
      alias: {
        'react$': require.resolve('react'),
        'react-dom$': require.resolve('react-dom'),
        'react-dom/server$': require.resolve('react-dom/server'),
        'react-formal$': path.resolve(__dirname, '../src/index.js'),
        'react-formal/lib': path.resolve(__dirname, '../src'),
      },
    },
    plugins: [
      // See https://github.com/FormidableLabs/react-live/issues/5
      plugins.ignore(/^(xor|props)$/),
    ],
  })
}

exports.onCreatePage = ({ page }) => {
  if (page.path.startsWith('/api')) {
    page.layout = 'api'
  }
}
