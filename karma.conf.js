'use strict';

module.exports = function (config) {
  
  config.set({

    basePath: '',

    frameworks: ['mocha'],

    reporters: ['mocha'],

    files: [
      'vendor/sinon-1.10.3.js', //because sinon hates webpack
      'test.js'
    ],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,

    logLevel: config.LOG_INFO,

    browsers: ['PhantomJS'], 

    preprocessors: {
      'test.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.configs').test,

    webpackServer: {
      noInfo: true
    }

  });
};