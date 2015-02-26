var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less-sourcemap');
var fs = require('fs');
var minifyCSS = require('gulp-minify-css');

// Less and CSS file mappings
var mappings = {
    dir: './less/**/*.less',
    main: './less/style.less',
    dest: './public/css/'
};

// Builds CSS from source
function buildLess(mappings) {
    gulp.src(mappings.main)
    .pipe(less())
    .on('error', function (error) {
        // Handle error to avoid gulp crashing
        gutil.log(gutil.colors.red(error.message))
    })
    .pipe(minifyCSS())
    .pipe(gulp.dest(mappings.dest));

    gutil.log('Compiling CSS:', gutil.colors.cyan(mappings.main));
}

// Rebuild CSS on source change
gulp.task('less:watch', function() {
    gulp.watch(mappings.dir, function() {
        buildLess(mappings);
    });
});

// Build CSS from source
gulp.task('less:build', function() {
    buildLess(mappings);
});

// Moves required fonts to public dir from node_modules
gulp.task('fonts:move', function() {
    // This is shit
    var dir = {
            src: './node_modules/font-awesome/fonts',
            dest: './public/fonts'
        };

    if(! fs.existsSync(dir.dest)) {
        fs.mkdir(dir.dest);
    }

    fs.readdir(dir.src, function(err, files){
        files.forEach(function(file) {
            fs.createReadStream(dir.src + '/' + file).pipe(fs.createWriteStream(dir.dest + '/' + file));
        });
    });
});

// Gulp watch task
gulp.task('watch', ['less:watch']);

// Gulp build task (run on app deployment)
gulp.task('build', ['less:build', 'fonts:move']);
