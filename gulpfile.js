'use strict';
var fs = require('fs')
  , gulp = require('gulp')
  , less = require('gulp-less')
  , babelTransform = require("gulp-babel-helpers")
  , rimraf  = require('rimraf')
  , rename  = require('gulp-rename')
  , plumber = require('gulp-plumber')
  , configs = require('./webpack.configs')
  , assign  = require('react/lib/Object.assign')
  , WebpackDevServer = require("webpack-dev-server")
  , webpack = require('webpack');


gulp.task('watch-less',  function(){
  gulp.src('./src/styles.less')
      .pipe(plumber())
      .pipe(less({ compress: false }))
      .pipe(gulp.dest('./dev/css'));
})

gulp.task('less', function(){
  gulp.src('./src/less/styles.less')
      .pipe(plumber())
      .pipe(less({ compress: true }))
      .pipe(gulp.dest('./lib/css'));
})

gulp.task('clean', function(cb){
  rimraf('./lib', cb);
})

gulp.task('build', ['clean'], function(){
  gulp.src('./src/*.less')
    .pipe(gulp.dest('./lib/less'))

  return gulp.src(['./src/**/*.jsx', './src/**/*.js'])
      .pipe(plumber())
      .pipe(babelTransform('./util/babelHelpers.js'))
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('./lib'));
})

gulp.task('dev', function() {

  gulp.watch('./src/*.less',  ['watch-less']);
  
  new WebpackDevServer(webpack(configs.dev), {
    publicPath: "/dev",
    stats: { colors: true }
  }).listen(8080, "localhost");
})



gulp.task('release', ['clean', 'build', 'less'])