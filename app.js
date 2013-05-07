/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./source/routes');
var http = require('http');
var path = require('path');
var passport = require('passport');
var engine = require('ejs-locals');

var loginRedirects = {
  successReturnToOrRedirect: '/setup',
  failureRedirect: '/'
};

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
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/app', routes.ensureAuth, routes.app);
app.get('/setup', routes.ensureAuth, routes.setup);

// Auth end-points
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', loginRedirects));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', loginRedirects));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', loginRedirects));

app.get('/logout', routes.logout);

app.post('/register', passport.authenticate('local', { successReturnToOrRedirect: '/app' }));
app.post('/setup', routes.firstTimeSetup);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
