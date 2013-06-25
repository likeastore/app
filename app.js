/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var middleware = require('./source/middleware');
var config = require('likeastore-config');
var logger = require('./source/utils/logger');

var oneMonth = 2678400000;
var oneHour = 3600000;

process.on('uncaughtException', function (err) {
	logger.error({msg:'Uncaught exception', error:err, stack:err.stack});
	console.log("Uncaught exception", err, err.stack && err.stack.toString()); //extra log, makes stack track clickable in webstorm
});

var app = express();

app.configure(function(){
	app.set('port', process.env.VCAP_APP_PORT || 3001);
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(middleware.errors.logHttpErrors());
	app.use(middleware.access.ensureUser());
	app.use(middleware.access.redirectUnauthorized());
	app.use(middleware.noCache());
	app.use(app.router);
	app.use(middleware.errors.logErrors());
});

app.configure('development', function(){
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(middleware.serveMaster.development());
});

app.configure('production', function(){
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));
	app.use(middleware.serveMaster.production());
});

require('./source/api')(app);
require('./source/router')(app);

http.createServer(app).listen(app.get('port'), function() {
	var env = process.env.NODE_ENV || 'development';
	logger.info('Likeastore app listening on port ' + app.get('port') + ' ' + env + ' mongo: ' + config.connection);
});
