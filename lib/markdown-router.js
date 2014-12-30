var fs = require('fs');
var md = require('node-markdown').Markdown;

var markdownRouter = function(filePath) {
    var extension = '.md',
        pages,
        pageRoutes = {},
        cache = {},
        configPrefix = '@',
        configRegex = new RegExp(configPrefix + '{(.*?)}');

    function isDev() {
        return process.env.NODE_ENV != 'production';
    }

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

        if (cache[path] && ! isDev()) {
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

    function getConfigVars(content) {
        var matches = content.match(configRegex);

        if (matches) {
            return JSON.parse(
                matches[0].replace(configPrefix, '')
            );
        }

        return {};
    }

    function buildPageIndex() {
        if (pages && ! isDev()) {
            return;
        }

        pages = fs.readdirSync(filePath);

        pages.forEach(function(filename) {
            pageRoutes[filenameToPath(filename)] = filename;
        });
    }

    buildPageIndex();

    return function(req, res, next) {
        var path = req.path,
            page;

        if (path !== '/') {
            path = req.path.replace(/\/$/, '');
        }

        page = pageRoutes[path];

        if (! page) {
            return next();
        }

        getPage(page, function(err, markdown) {
            var pageVars = getConfigVars(markdown);
            for (var configVar in pageVars) {
                res.locals[configVar] = pageVars[configVar];
            }

            res.render('markdown', {
                content: md(markdown.replace(configRegex, ''))
            });
        });
    }
}

module.exports = markdownRouter;
