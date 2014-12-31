var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less-sourcemap');
var fs = require('fs');
var minifyCSS = require('gulp-minify-css');

var moveFonts = require('./build/fonts');

var mappings = {
    dir: './less/**/*.less',
    main: './less/style.less',
    dest: './public/css/'
};

function buildLess(mappings) {
    gulp.src(mappings.main)
    .pipe(less())
    .on('error', function (error) {
        gutil.log(gutil.colors.red(error.message))
    })
    .pipe(minifyCSS())
    .pipe(gulp.dest(mappings.dest));

    gutil.log('Compiling CSS:', gutil.colors.cyan(mappings.main));
}

gulp.task('less:watch', function() {
    gulp.watch(mappings.dir, function() {
        buildLess(mappings);
    });
});

gulp.task('less:build', function() {
    buildLess(mappings);
});

gulp.task('fonts:move', function() {
    moveFonts(__dirname);
});

gulp.task('watch', ['less:watch']);

gulp.task('build', ['less:build', 'fonts:move']);

