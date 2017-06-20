var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), //why didn't we add a gulp-sass?
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

gulp.task('connect', function(){
  connect.server({
    root: 'builds/development',
    livereload: true});
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(connect.reload())
    .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images', //why is the images here?
      style: 'expanded',
      comments: true //what does this do again?
    })
    .on('error', gutil.log))
    .pipe(connect.reload())
    .pipe(gulp.dest('builds/development/css'))
});

/*So this task 'watch' has a function to watch whatever is specified 
using the gulp.watch method.

The method used here are watching the coffee script, javascript and sass
sources, then each time in each method it calls for the corresponding task
to be ran so that data is moved into development. This sets up live reloading.
 */
gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']); //dest, redo command
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);

