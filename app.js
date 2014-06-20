/**
 * Module dependencies.
 */

require('newrelic');

var config = require('./config');
var logger = require('./source/utils/logger');
var nodalytics = require('nodalytics');

var oneMonth = 2678400000;

var express = require('express');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var middleware = require('./source/middleware');
var applyAuthentication = require('./source/utils/applyAuthentication');
var applyErrorLogging = require('./source/utils/applyErrorLogging');

var app = express();

var cors = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin !== 'null' && req.headers.origin || '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

	next();
};

app.configure(function(){
	app.set('port', process.env.PORT || 3001);
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon(path.join(__dirname, 'public/img/favicon.png')));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(middleware.noCache());
	app.use(middleware.errors.logHttpErrors());
	app.use(cors);
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(middleware.serveMaster.development());
});

app.configure('test', function() {
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(middleware.serveMaster.development());
});

app.configure('staging', function() {
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
	app.use(middleware.serveMaster.production());
});

app.configure('production', function() {
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
	app.use(nodalytics(config.nodalytics.ua));
	app.use(middleware.serveMaster.production());
});

require('./source/api')(app);
require('./source/router')(app);

applyAuthentication(app, ['/api']);
applyErrorLogging(app);

http.createServer(app).listen(app.get('port'), function() {
	var env = process.env.NODE_ENV || 'development';
	logger.info('Likeastore app listening on port ' + app.get('port') + ' ' + env + ' mongo: ' + config.connection);
});
