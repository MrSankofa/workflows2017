var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'compressed';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'nested';
}


coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'

];

sassSources = ['components/sass/*.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + '/js/*.json'];

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
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())

});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			css: outputDir + 'css',
			image: outputDir + 'images',
			style: sassStyle,
			comments: true
		}))
		.pipe(connect.reload())
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir +'css'))


});


/*So this task 'watch' has a function to watch whatever is specified 
using the gulp.watch method.

The method used here are watching the coffee script, javascript and sass
sources, then each time in each method it calls for the corresponding task
to be ran so that data is moved into development. This sets up live reloading.
 */
gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch(sassSources, ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
	
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function(){
	gulp.src(htmlSources).pipe(connect.reload())

});

gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'coffee', 'js', 'compass', 'connect', 'watch']);