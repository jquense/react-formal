var webpackConfig = require('./webpack/test.config');

module.exports = function (config) {

  config.set({

    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    reporters: ['mocha'],

    files: [
      'test.js'
    ],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,

    logLevel: config.LOG_INFO,

    browsers: ['jsdom'],

    preprocessors: {
      'test.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true
    }

  });
};
