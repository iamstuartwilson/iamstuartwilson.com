var md = require('node-markdown').Markdown;
var fs = require('fs');

var PageParser = function() {
    var defaults = {
        dir: __dirname + '/pages'
    },
    options = {};

    function init() {
        dir(defaults.dir);
    }

    function dir(newDir) {
        if (newDir) {
            options.dir = newDir;
        }

        return options.dir;
    }

    function getFilePath(fileName) {
        return dir() + '/' + fileName + '.md';
    }

    function openFile(fileName, callback) {
        fs.readFile(
            getFilePath(fileName),
            {encoding: 'utf8'},
            callback
        );
    }

    function parse(fileName, callback) {
        openFile(fileName, function(err, data) {
            if (err) {
                throw(err);

                return;
            }
            callback(md(data));
        });
    }

    init();

    return {
        dir: dir,
        parse: parse
    };
}

module.exports = new PageParser;
