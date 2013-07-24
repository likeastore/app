/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var middleware = require('./source/middleware');
var applyAuthentication = require('./source/utils/applyAuthentication');
var applyErrorLogging = require('./source/utils/applyErrorLogging');
var config = require('./config');
var logger = require('./source/utils/logger');

var oneMonth = 2678400000;

process.on('uncaughtException', function (err) {
	logger.error({msg:'Uncaught exception', error:err, stack:err.stack});
	console.log({msg:'Uncaught exception', error:err, stack:err.stack});
});

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3001);
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(middleware.noCache());
	app.use(middleware.errors.logHttpErrors());
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.logger('dev'));
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
	app.use(express.logger('short'));
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
	app.use(middleware.serveMaster.production());
});

app.configure('production', function() {
	app.use(express.logger('short'));
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
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
