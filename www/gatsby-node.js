const path = require('path');

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      babelrcRoots: true,
    },
  });
};

exports.onCreateWebpackConfig = function onCreateWebpackConfig({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        'react': path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        'react-formal': path.resolve('../src'),
        '@docs': path.resolve('./src'),
      },
    },
  });
};
