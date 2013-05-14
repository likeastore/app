/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var engine = require('ejs-locals');

// oauth init
require('./source/utils/auth.js')(passport);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./source/api.js')(app, passport);
require('./source/router.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
