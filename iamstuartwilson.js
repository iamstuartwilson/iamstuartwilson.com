var express = require('express');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var compression = require('compression');
var markdownRouter = require('express-markdown-router');

// Create app
var app = express();

// Gzip compression
app.use(compression());

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

// Custom markdown file based routing
app.use(markdownRouter(__dirname + '/pages', 'markdown'));

// Error handlers
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// App setup
app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});
