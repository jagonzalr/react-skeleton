
'use strict';

var gulp    = require('gulp'),
    htmlmin = require('gulp-htmlmin');

/*
* HTML
*/

gulp.task("minify-html", function() {
    return gulp.src('dev/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'))
});
