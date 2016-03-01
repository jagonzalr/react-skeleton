
'use strict';

var babelify    = require('babelify'),
    browserify  = require('browserify'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    rename      = require("gulp-rename"),
    uglify      = require('gulp-uglify')

/*
* Javascript
*/

gulp.task("babelify", function () {
    return browserify('src/main.jsx')
        .transform(babelify, {presets: ["react"]})
        .bundle()
        .pipe(fs.createWriteStream('dev/js/main.js'));
});

gulp.task('minify-js', ['babelify'], function() {
    return gulp.src('dev/js/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
});
