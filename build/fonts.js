var fs = require('fs');

function moveFonts(root) {
    var dir = {
            src: root +'/node_modules/font-awesome/fonts',
            dest: root + '/public/fonts'
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

module.exports = moveFonts;
