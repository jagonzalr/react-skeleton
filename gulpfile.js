
'use strict'

var browserSync = require('browser-sync'),
    gulp        = require('gulp'),
    inject      = require('gulp-inject'),
    requireDir  = require('require-dir');

requireDir('./gulp-tasks/');
browserSync.create();

/*
* Inject
*/

gulp.task('inject-css-dev', ['sass'], function() {
  return gulp.src('./dev/index.html')
    .pipe(inject(
        gulp.src('./dev/css/*.css', {read: false}),
        {ignorePath: 'dev', addRootSlash: false}))
    .pipe(gulp.dest('./dev'))
    .pipe(browserSync.stream());
});

gulp.task('inject-js-dev',['babelify'], function() {
  return gulp.src('./dev/index.html')
    .pipe(inject(
        gulp.src('./dev/js/*.js', {read: false}),
        {ignorePath: 'dev', addRootSlash: false}))
    .pipe(gulp.dest('./dev'));
});

gulp.task('inject-css-dist', ['minify-css'], function() {
  return gulp.src('./dist/index.html')
    .pipe(inject(
        gulp.src('./dist/css/*.css', {read: false}),
        {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('inject-js-dist', ['minify-js'], function() {
  return gulp.src('./dist/index.html')
    .pipe(inject(
        gulp.src('./dist/js/*.js', {read: false}),
        {ignorePath: 'dist', addRootSlash: false}))
    .pipe(gulp.dest('./dist'));
});

/*
* Builds
*/

gulp.task('dist', ['minify-html', 'inject-css-dist', 'inject-js-dist']);

gulp.task('dev', ['inject-css-dev', 'inject-js-dev'], function() {
  browserSync.init({
      server: {
          baseDir: "./dev"
      }
  });

  gulp.watch(['src/*.scss', 'src/stylesheets/*.scss'], ['inject-css-dev']);
  gulp.watch(['src/*.jsx', 'src/components/*.jsx'], ['inject-js-dev'], browserSync.reload);
  gulp.watch("dev/*.html").on('change', browserSync.reload);
});


/*
* Default
*/

gulp.task('default', ['dev']);
