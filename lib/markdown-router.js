var fs = require('fs');
var md = require('node-markdown').Markdown;

var markdownRouter = function(filePath, app) {
    var extension = '.md',
        pages,
        pageRoutes = [],
        cache = {};

    function filenameToPath(filename) {
        filename = removeExtension(filename);

        var specialRoutes = {
            index: '/'
        };

        if (specialRoutes[filename]) {
            return specialRoutes[filename];
        }

        return '/' + filename.replace('.', '/');
    }

    function removeExtension(filename) {
        return filename.replace(extension, '');
    }

    function isMarkdownFile(filname) {
        return filename !== removeExtension(filename);
    }

    function getPage(filename, callback) {
        var file = filePath + '/' + filename,
            path = filenameToPath(filename);

        if (cache[path] && process.env.NODE_ENV != 'development') {
            callback(null, cache[path]);

            return;
        }

        fs.readFile(
            file,
            {encoding: 'utf8'},
            function(err, data) {
                cache[path] = data;
                callback(err, data);
            }
        );
    }

    function renderPage(filename) {
        return function(req, res) {
            getPage(filename, function(err, markdown) {
                res.render('markdown', {
                    content: md(markdown)
                });
            });
        }
    }

    pages = fs.readdirSync(filePath);

    pages.forEach(function(filename) {
        pageRoutes.push(filenameToPath(filename));
    });

    pages.forEach(function(filename) {
        app.get(filenameToPath(filename), renderPage(filename));
    });
}

module.exports = markdownRouter;
