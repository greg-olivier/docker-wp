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
var webpackThemeConfig   = require('./themes/my-theme/webpack.config.js');
var webpackPluginConfig   = require('./plugins/my-plugin/webpack.config.js');
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
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file


// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(yargs.argv.dev);

// Load settings from config.yml
const { COMPATIBILITY, THEME_PATHS, PLUGIN_PATHS, PROJECT } = loadConfig();

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

/******************** THEME TASK *********************/
/**
* Task: Webpack for JS
* Processing JS with Webpack according to webpack.config.js
*/
gulp.task('webpack-theme', function() {
  return gulp.src(THEME_PATHS.webpackEntry)
  .pipe(plumber({ errorHandler: function(err) {
    notify.onError({
      title: "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
  }}))
  .pipe(webpackStream(webpackThemeConfig), webpack)
  .pipe(gulpif(PRODUCTION, $.uglify()))
  .pipe(gulp.dest(THEME_PATHS.jsDist))
  .pipe( notify( { message: 'TASK: "webpack" Completed!'} ) );
});


/**
 * Task: Webpack for JS
 * Processing JS with Webpack according to webpack.config.js
 */
gulp.task('webpack-plugin', function() {
    return gulp.src(PLUGIN_PATHS.webpackEntry)
        .pipe(plumber({ errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message:  err.toString()
                })(err);
            }}))
        .pipe(webpackStream(webpackPluginConfig), webpack)
        .pipe(gulpif(PRODUCTION, $.uglify()))
        .pipe(gulp.dest(PLUGIN_PATHS.jsDist))
        .pipe( notify( { message: 'TASK: "webpack-theme" Completed!'} ) );
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

gulp.task('styles-theme', function () {

   return gulp.src( THEME_PATHS.scssEntry )
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
    .pipe( gulp.dest( THEME_PATHS.cssDist ) )
    .pipe( browserSync.reload({ stream : true }))
    .pipe( notify( { message: 'TASK: "styles-theme" Completed!', onLast: true } ) )

  });


/**
* Task: `fonts`.
* Copy fonts to assets folder
*/
gulp.task('fonts-theme', function(){
  return gulp.src(THEME_PATHS.fontSrc)
  .pipe(gulp.dest(THEME_PATHS.fontDist));
});


/******************** PLUGIN TASKS *********************/

/**
 * Task: Webpack for JS
 * Processing JS with Webpack according to webpack.config.js
 */
gulp.task('webpack-plugin', function() {
    return gulp.src(PLUGIN_PATHS.webpackEntry)
        .pipe(plumber({ errorHandler: function(err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message:  err.toString()
                })(err);
            }}))
        .pipe(webpackStream(webpackPluginConfig), webpack)
        .pipe(gulpif(PRODUCTION, $.uglify()))
        .pipe(gulp.dest(PLUGIN_PATHS.jsDist))
        .pipe( notify( { message: 'TASK: "webpack-plugin" Completed!'} ) );
});


/**
 * Task: `styles`.
 * Concat (@import all files in one), compatibility prefix & minify
 */
gulp.task('styles-plugin', function () {
    console.log(PLUGIN_PATHS);
    return gulp.src( PLUGIN_PATHS.scssEntry )
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
        .pipe( gulp.dest( PLUGIN_PATHS.cssDist ) )
        .pipe( browserSync.reload({ stream : true }))
        .pipe( notify( { message: 'TASK: "styles-plugin" Completed!', onLast: true } ) )

});

/**
 * Task: `fonts`.
 * Copy fonts to assets folder
 */
gulp.task('fonts-plugin', function(){
    return gulp.src(PLUGIN_PATHS.fontSrc)
        .pipe(gulp.dest(PLUGIN_PATHS.fontDist));
});



/******************** GENERAL TASKS *********************/


gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done()
});


/**
* Task: `serve`.
* Watch and reload on change
*/
gulp.task('serve', function() {
  // Tracked files
    var files = [
        THEME_PATHS.jsTrack,
        THEME_PATHS.cssTrack,
        THEME_PATHS.phpTrack
    ];
    if (PLUGIN_PATHS){
      files.push(
          PLUGIN_PATHS.jsTrack,
          PLUGIN_PATHS.cssTrack,
          PLUGIN_PATHS.phpTrack)
    }
  console.log('plugin_paths', PLUGIN_PATHS);
  // Initialize browsersync
  browserSync.init(files, {
    proxy: process.env.BROWSERSYNC_PROXY,
    port: process.env.VIRTUAL_PORT,
    ui: false,
    open: false
  });

  // Watches for file changes and runs specific tasks.
  gulp.watch(THEME_PATHS.jsSrc, gulp.series('webpack-theme', 'bs-reload'));
  gulp.watch(THEME_PATHS.cssSrc, gulp.series('styles-theme', 'bs-reload'));
  gulp.watch(THEME_PATHS.phpTrack, gulp.series('bs-reload'));

  if (PLUGIN_PATHS) {
    gulp.watch(PLUGIN_PATHS.jsSrc, gulp.series('webpack-plugin', 'bs-reload'));
    gulp.watch(PLUGIN_PATHS.cssSrc, gulp.series('styles-plugin', 'bs-reload'));
    gulp.watch(PLUGIN_PATHS.phpTrack, gulp.series('bs-reload'));
  }
});


/**
* Init tasks
*/

if (PLUGIN_PATHS){
    gulp.task('default', gulp.series(gulp.parallel('styles-theme', 'webpack-theme', 'fonts-theme', 'styles-plugin', 'webpack-plugin', 'fonts-plugin'), 'serve'))
} else {
    gulp.task('default', gulp.series(gulp.parallel('styles-theme', 'webpack-theme', 'fonts-theme'), 'serve'))
}



/**
* Build tasks
*/
if (PLUGIN_PATHS) {
    gulp.task('build', gulp.series(['styles-theme', 'webpack-theme', 'fonts-theme', 'styles-plugin', 'webpack-plugin', 'fonts-plugin']))
} else {
    gulp.task('build', gulp.series(['styles-theme', 'webpack-theme', 'fonts-theme']))
}


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
