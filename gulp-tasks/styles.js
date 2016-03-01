
'use strict';
var cleanCSS    = require('gulp-clean-css'),
    gulp        = require('gulp'),
    merge       = require('merge-stream'),
    rename      = require("gulp-rename"),
    sass        = require('gulp-sass');

/*
* Stylesheets
*/

gulp.task("sass", function () {
    var folders = ["src/*.scss", "src/stylesheets/*.scss"];
    var tasks = folders.map(function(element){
        return gulp.src(element)
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(gulp.dest('dev/css/'));
    });

    return merge(tasks);
});

gulp.task('minify-css', function() {
  return gulp.src('dev/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'));
});
