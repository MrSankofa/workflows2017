var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), //why didn't we add a gulp-sass?
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
  coffeeSources,
  jsSources,
  htmlSources,
  jsonSources,
  sassSources,
  outputDir,
  sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'compressed';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

htmlSources = ['outputDir' + '*.html'];
jsonSources = ['outputDir' + 'js/*.json'];
sassSources = ['components/sass/style.scss'];

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
    .pipe(gulp.dest(outputDir + 'js'))
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      css: outputDir + 'css',
      image: outputDir + 'images', //why is the images here?
      style: sassStyle,
      comments: true
    }))
    .on('error', gutil.log)
    .pipe(connect.reload())
    .pipe(gulp.dest(outputDir + 'css'))
});

gulp.task('json', function() {
  gulp.src(jsonSources)
  .pipe(connect.reload())
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(connect.reload())
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true});
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
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);

