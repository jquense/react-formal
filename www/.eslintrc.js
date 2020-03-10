const path = require('path');

module.exports = {
  extends: '../.eslintrc.yml',
  rules: {
    'react/prop-types': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/resolver': {
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
