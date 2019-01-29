const path = require('path')

const { root } = require('./constants')

let pkg = {}
try {
  pkg = require(`${root}/package.json`)
} catch (err) {
  console.error(err)
}

exports.onCreateWebpackConfig = function onCreateWebpackConfig({
  actions,
  plugins,
  loaders,
}) {
  actions.setWebpackConfig({
    devtool: 'cheap-inline-module-source-map',
    module: {
      rules: [
        {
          include: path.resolve(__dirname, 'src/examples'),
          use: loaders.raw(),
        },
      ],
    },
    resolve: {
      alias: {
        [`${pkg.name}$`]: path.resolve(root, 'src/index.js'),
        [`${pkg.name}/lib`]: path.resolve(root, 'src'),
      },
    },
    plugins: [
      // See https://github.com/FormidableLabs/react-live/issues/5
      plugins.ignore(/^(xor|props)$/),
    ],
  })
}

exports.createPages = ({ actions }) => {
  const { createRedirect } = actions
  createRedirect({
    fromPath: `/api`,
    toPath: `/api/Form`,
    isPermanent: true,
  })
}

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      root,
    },
  })
}
