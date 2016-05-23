
'use strict'

var babelify    = require('babelify'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync'),
    cleanCSS    = require('gulp-clean-css'),
    del         = require('del'),
    gulp        = require('gulp'),
    gutil = require('gulp-util'),
    htmlmin = require('gulp-htmlmin'),
    inject      = require('gulp-inject'),
    rename      = require("gulp-rename"),
    sass        = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    uglify      = require('gulp-uglify');

browserSync.create();

/*
* HTML
*/

gulp.task('htmlToTmp', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('.tmp/'));
})

gulp.task("minify-html", ['htmlToTmp'], function() {
    return gulp.src('.tmp/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'))
});

/*
* CSS
*/

gulp.task("sass", function () {
  return gulp.src('src/main.scss')
      .pipe(sass.sync()
      .on('error', function(e) {
        gutil.log(e);
      }))
      .pipe(gulp.dest('.tmp/css/'))
      .pipe(browserSync.stream());
});

gulp.task('minify-css', ['sass'], function() {
  return gulp.src('.tmp/css/main.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'));
});

/*
* JS
*/

gulp.task("babelify", function () {
    return browserify('src/main.jsx')
        .transform(babelify, {presets: ["react"]})
        .bundle()
        .on('error', function(e) {
          gutil.log(e);
        })
        .pipe(source('main.js'))
        .pipe(gulp.dest('.tmp/js'))
        .pipe(browserSync.stream());
});

gulp.task('minify-js', ['babelify'], function() {
    return gulp.src('.tmp/js/main.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
});

/*
* Inject
*/

gulp.task('inject-static', ['sass', 'babelify'], function() {
  return gulp.src('.tmp/*.html')
    .pipe(inject(
      gulp.src('.tmp/css/main.css', {read: false}),
      {ignorePath: '.tmp', addRootSlash: true}))
    .pipe(gulp.dest('.tmp'))
    .pipe(inject(
      gulp.src('.tmp/js/main.js', {read: false}),
      {ignorePath: '.tmp', addRootSlash: true}))
    .pipe(gulp.dest('.tmp'));
});

/*
* Builds
*/

gulp.task('clean', function() {
  return gulp.src('.tmp/')
		.pipe(clean({force: true}))
		.pipe(gulp.dest('.tmp/'));
});

// gulp.task('build', ['minify-html'], function() {
//   gulp.start(['inject:minified', 'images-min']);
// });


gulp.task('serve', ['htmlToTmp'], function() {
  gulp.start(['inject-static'], function() {
    browserSync.init({
      notify: false,
      port: 3000,
      server: {
          baseDir: '.tmp'
      }
    });
  });

  gulp.watch(['src/main.scss', 'src/stylesheets/*.scss'], ['inject-static']);
  gulp.watch(['src/main.jsx', 'src/components/*.jsx'], ['inject-static']);
  gulp.watch(['src/*.html', 'src/partials/*.html'], ['htmlToTmp']).on('change', browserSync.reload);
});


/*
* Default
*/

// gulp.task('default', ['clean']);
