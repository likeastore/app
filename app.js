/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./source/router.js');
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
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app main urls
app.get('/', routes.index);
app.get('/app', routes.ensureAuth, routes.app);

// registration strategies
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', loginRedirects));
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', loginRedirects));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', loginRedirects));

// authorization strategies
app.get('/connect/twitter', passport.authorize('twitter-authz'));
app.get('/connect/twitter/callback', passport.authorize('twitter-authz'), function (req, res) { res.redirect('/app'); });
app.get('/connect/github', passport.authorize('github-authz'));
app.get('/connect/github/callback', passport.authorize('github-authz'), function (req, res) { res.redirect('/app'); });


// setup page
app.get('/setup', routes.ensureAuth, routes.setup);
app.post('/setup', routes.makeSetup);

// native register & login
app.post('/register', passport.authenticate('local', { successReturnToOrRedirect: '/app' }));
app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/app' }));

// logout from app
app.get('/logout', routes.logout);
app.get('*', routes.ensureAuth, routes.app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
