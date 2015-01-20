'use strict';
var gulp    = require('gulp')
  , configs = require('./webpack.configs')
  , less = require('gulp-less')
  , plumber = require('gulp-plumber')
  , WebpackDevServer = require("webpack-dev-server")
  , webpack = require('webpack');


gulp.task('watch-less',  function(){
    gulp.src('./src/styles.less')
        .pipe(plumber())
        .pipe(less({ compress: true }))
        .pipe(gulp.dest('./dev/css'));
  })

module.exports = {

  devServer: function() {

    gulp.watch('./src/*.less',  ['watch-less']);
    
    new WebpackDevServer(webpack(configs.dev), {
      publicPath: "/dev",
      stats: { colors: true }
    }).listen(8080, "localhost");
  }

}

