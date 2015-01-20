'use strict';
var gulp = require('gulp')
  , dev  = require('./tasks/development')
  , less = require('gulp-less')
  , replace = require('gulp-replace')
  , clean = require('gulp-clean')
  , gulpReact = require('gulp-react')
  , plumber = require('gulp-plumber');

gulp.task('dev', dev.devServer)


gulp.task('clean', function(){
  return gulp.src('./lib/*', { read: false })
    .pipe(clean())
})

gulp.task('build', ['clean'], function(){
  gulp.src('./src/less/*.less')
    .pipe(gulp.dest('./lib/less'))

  return gulp.src(['./src/**/*.jsx', './src/**/*.js'])
      .pipe(plumber())
      .pipe(gulpReact({ harmony: true }))
      .pipe(replace(/\.jsx/g, ''))
      .pipe(gulp.dest('./lib'));
})

gulp.task('less', function(){
  gulp.src('./src/less/validator.less')
      .pipe(plumber())
      .pipe(less({ compress: true }))
      .pipe(gulp.dest('./dist/css'));
})



