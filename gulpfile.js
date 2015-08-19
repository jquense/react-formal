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
  , merge = require('merge-stream')
  , webpack = require('webpack');


gulp.task('watch-less',  function(){
  gulp.src('./src/styles.less')
      .pipe(plumber())
      .pipe(less({ compress: false }))
      .pipe(gulp.dest('./dev/css'));
})


gulp.task('clean', function(cb){
  rimraf('./lib', cb);
})

gulp.task('less', ['clean'], function(){
  gulp.src('./src/less/styles.less')
      .pipe(plumber())
      .pipe(less({ compress: true }))
      .pipe(gulp.dest('./lib/css'));
})

gulp.task('build', ['clean'], function(){
  return merge(
    gulp.src('./src/*.less')
      .pipe(gulp.dest('./lib/less')),

    gulp.src(['./src/**/*.jsx', './src/**/*.js'])
     // .pipe(plumber())
      .pipe(babelTransform({ loose: 'all' },'./util/babelHelpers.js'))
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('./lib'))
  )
})

gulp.task('dev', function() {

  gulp.watch('./src/*.less',  ['watch-less']);

  new WebpackDevServer(webpack(configs.dev), {
    publicPath: "/dev",
    stats: { colors: true }
  }).listen(8080, "localhost");
})


gulp.task('gen-docs', function(){
  return merge(
    gulp.src(['./src/**/*.jsx', './src/**/*.js'])
      .pipe(require('./docs/gulp/parse-docs')())
      .pipe(gulp.dest('./docs/components')),

    gulp.src('./docs/pages/*.md')
      .pipe(require('./docs/gulp/md-to-jsx')())
      .pipe(gulp.dest('./docs/components'))
  )
})

gulp.task('docs', function(cb){
  webpack(configs.docs, function(err, stat){
    console.log(stat.compilation.errors)
    cb()
  })
})

gulp.task('dev-docs', function() {
  gulp.watch(['./src/**/*.js*', './docs/pages/*.md'], ['gen-docs'])

  new WebpackDevServer(webpack(configs.docs), {
    publicPath: "/docs",
    stats: { colors: true }
  }).listen(8080, "localhost");
})

gulp.task('release', ['clean', 'build', 'less'])

gulp.task('publish', ['release'], require('jq-release'))