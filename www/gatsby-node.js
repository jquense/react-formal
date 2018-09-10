const path = require('path')

exports.onCreateWebpackConfig = ({ plugins, loaders, actions }) => {
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
        // react$: require.resolve('react'),
        // 'react-dom$': require.resolve('react-dom'),
        // 'react-dom/server$': require.resolve('react-dom/server'),
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

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      root: path.resolve(__dirname, '../'),
    },
  })
}
