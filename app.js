/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var engine = require('ejs-locals');
var middleware = require('./source/middleware');
var config = require('likeastore-config');

var oneMonth = 2678400000;

// oauth init
require('./source/utils/auth.js')(passport);

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3001);
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('likeastore_secret7'));
	app.use(express.session({ secret: 'likeastore_secret'}));
	app.use(express.compress());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(middleware.access.ensureUser());
	app.use(middleware.access.redirectUnauthorized());
	app.use(middleware.noCache());
	app.use(app.router);
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

require('./source/api.js')(app, passport);
require('./source/router.js')(app);

http.createServer(app).listen(app.get('port'), function() {
	var env = process.env.NODE_ENV || 'development';
  	console.log('Likeastore app listening on port ' + app.get('port') + ' ' + env + ' mongo: ' + config.connection);
});
