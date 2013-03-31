
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var everyauth = require('everyauth');
var auth = require('./src/modules/auth.js')(everyauth);
var handshake = require('./src/api/handshake.js');
var items = require('./src/api/items.js');
var github = require('./src/api/connector/github.js');
var twitter = require('./src/api/connector/twitter.js');

var routes = require('./routes')(everyauth);
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret'}));
  app.use(express.methodOverride());
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/setup', routes.setup);
app.get('/dashboard', routes.dashboard);

// open api routes
handshake(app);
items(app);

// private api routes
github(app);
twitter(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});