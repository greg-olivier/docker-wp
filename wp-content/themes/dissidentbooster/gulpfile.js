'use strict';

/**
* Load Plugins.
*
* Load gulp plugins and assing them semantic names.
*/
var $                    = require('gulp-load-plugins')();
var yaml                 = require('js-yaml');
var fs                   = require('fs');
var yargs                = require('yargs');
var gulp                 = require('gulp'); // Gulp of-course
var gulpif               = require('gulp-if');
var webpack              = require('webpack');
var webpackStream        = require('webpack-stream');
var webpackConfig        = require('./webpack.config.js');
var plumber              = require('gulp-plumber');


// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var cssConcat    = require('gulp-concat-css');

// JS
var uglify       = require('gulp-uglify'); //Minifies JS files


// Utility related plugins.
var notify       = require('gulp-notify'); // ###### Can't notify from docker container => to change ######
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file


// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(yargs.argv.dev);

// Load settings from config.yml
const { BROWSERSYNC, COMPATIBILITY, REVISIONING, PATHS, PROJECT } = loadConfig();

// Load YML config file if exists
function loadConfig() {

  if (checkFileExists('config.yml')) {
    // config.yml exists, load it
    var ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);

  } else {
    // Exit if config.yml & config-default.yml do not exist
    notify('Exiting process, no config file exists.');
    process.exit(1);
  }
}

// Check if file exists synchronously
function checkFileExists(filepath) {
  var flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}


/**
* Task: Webpack for JS
* Processing JS with Webpack according to webpack.config.js
*/
gulp.task('webpack', function() {
  return gulp.src('src/js/app.js')
  .pipe(plumber({ errorHandler: function(err) {
    notify.onError({
      title: "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
  }}))
  .pipe(webpackStream(webpackConfig), webpack)
  .pipe(gulpif(PRODUCTION, $.uglify()))
  .pipe(gulp.dest('assets/js/'))
  .pipe( notify( { message: 'TASK: "webpack" Completed!'} ) );
});


/**
* Task: `styles`.
* Concat (@import all files in one), compatibility prefix & minify
*/
// gulp.task('styles', function () {
//   return gulp.src( 'src/css/app.css' )
//   .pipe(plumber({ errorHandler: function(err) {
//     notify.onError({
//       title: "Gulp error in " + err.plugin,
//       message:  err.toString()
//     })(err);
//   }}))
//   .pipe( cssConcat("app.css") )
//   .pipe( autoprefixer( COMPATIBILITY ) )
//   .pipe( gulpif( PRODUCTION, minifycss() ) ) //minifie uniquement en environnment de prod
//   .pipe( gulp.dest( 'assets/css' ) )
//   .pipe( browserSync.reload({ stream : true }) )
//   .pipe( notify( { message: 'TASK: "styles" Completed!', onLast: true } ) )
//
// });


gulp.task('styles', function () {

   return gulp.src( 'src/scss/app.scss' )
   .pipe(plumber({ errorHandler: function(err) {
    notify.onError({
      title: "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
            }}))
   .pipe( sourcemaps.init() )
   .pipe( sass( {
    errLogToConsole: true,
 		// 	outputStyle: 'compact'
 			outputStyle: 'compressed',
 			// outputStyle: 'nested',
 			//outputStyle: 'expanded',
 		} ) )
   .pipe( autoprefixer( COMPATIBILITY ) )
    .pipe(gulpif(!PRODUCTION, $.sourcemaps.write())) //ecrit le sourcemap uniquement en environnement dev
    .pipe(gulpif(PRODUCTION, minifycss())) //minifie uniquement en environnment de prod
    .pipe( gulp.dest( 'assets/css' ) )
    .pipe( browserSync.reload({ stream : true }))
    .pipe( notify( { message: 'TASK: "styles" Completed!', onLast: true } ) )

  });


/**
* Task: `fonts`.
* Copy fonts to assets folder
*/
gulp.task('fonts', function(){
  return gulp.src('./src/fonts/**')
  .pipe(gulp.dest('./assets/fonts'));
});



/**
* Task: `serve`.
* Watch and reload on change
*/
gulp.task('serve', function() {
  // Tracked files
  var files = [
    './assets/css/*.css',
    './*.php',
    './assets/js/*.js'
  ];

  // Initialize browsersync
  browserSync.init(files, {
    proxy: "192.168.0.1:8000"
  });
  // Watches for file changes and runs specific tasks.
  gulp.watch(PATHS.js, gulp.series('webpack'));
  gulp.watch( PATHS.css, gulp.series('styles') );
  gulp.watch(PATHS.php, reload);
})


/**
* Init tasks
*/
gulp.task('default', gulp.series(gulp.parallel('styles', 'webpack', 'fonts'), 'serve'))


/**
* Build tasks
*/

gulp.task('build', gulp.series(['styles', 'webpack', 'fonts']))




/**
* BONUS IMAGES
* Task: `images`.
*
* Minifies PNG, JPEG, GIF and SVG images.
*
* This task does the following:
*     1. Gets the source of images raw folder
*     2. Minifies PNG, JPEG, GIF and SVG images
*     3. Generates and saves the optimized images
*
* This task will run only once, if you want to run it
* again, do it with the command `gulp images`.
*/
// gulp.task( 'images', function() {
//   return gulp.src( PATHS.img )
//   .pipe(gulp.dest( 'assets/img/' ))
//   .pipe( notify( { message: 'TASK: "images" Completed! 💯', onLast: true } ) );
// });
