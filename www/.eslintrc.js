const path = require('path');

console.log(path.resolve('../src'));
module.exports = {
  extends: '../.eslintrc.yml',
  rules: {
    'react/prop-types': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/resolver': {
      node: {},
      webpack: {
        config: {
          resolve: {
            symlinks: false,
            extensions: ['.js', '.ts', '.tsx'],
            alias: {
              'react-formal': path.resolve('../src'),
            },
          },
        },
      },
    },
  },
};
