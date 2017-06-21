var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'), //why didn't we add a gulp-sass?
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-minify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
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
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

htmlSources = ['outputDir' + '*.html'];
jsonSources = ['outputDir' + 'js/*.json'];
sassSources = ['components/sass/style.scss'];

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
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
    .pipe(gulpif(env === 'production', uglify()))
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
  gulp.src('builds/development/js/*.json')
  .pipe(gulpif( env === 'production', jsonminify()))
  .pipe(gulpif( env === 'production', gulp.dest('builds/production/js')))
  .pipe(connect.reload())
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(gulpif( env === 'production', minifyHTML()))
  .pipe(gulpif( env === 'production', gulp.dest(outputDir)))
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

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);

