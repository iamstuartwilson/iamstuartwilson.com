var express = require('express');
var exphbs = require('express3-handlebars');
var pageParser = require('./lib/page-parser');
var favicon = require('serve-favicon');

// Create app
var app = express();

// Templating with Handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// Set port, default to 3000 if not pre-set
app.set('port', process.env.PORT || 3000);

// Static files
app.use(express.static(__dirname + '/public'));

// Favicon
app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Routing

pageParser.dir(__dirname + '/pages');

app.get('/', function(req, res) {
    pageParser.parse('index', function(content) {
        res.render('index', {
            content: content
        });
    });
});

// Error handlers
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});
