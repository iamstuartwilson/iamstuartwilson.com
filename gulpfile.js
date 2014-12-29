var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less-sourcemap');
var fs = require('fs');

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
    .pipe(gulp.dest(mappings.dest));

    gutil.log('Compiling CSS:', gutil.colors.cyan(mappings.main));
}

function moveFonts() {
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
    moveFonts();
});

gulp.task('watch', ['less:watch']);

gulp.task('build', ['less:build', 'fonts:move']);

