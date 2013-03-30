
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , setup = require('./routes/setup')
  , http = require('http')
  , path = require('path');

var everyauth = require('everyauth');
var auth = require('./source/modules/auth.js')(everyauth);
var githubConnector = require('./source/modules/githubConnector.js');

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
app.get('/users', user.list);

auth.on('auth:connected', function (data) {
  githubConnector.handshake(data.token, function (err, response) {
    if (err) {
      return console.log('Failed handshake to github-connector.');
    }

    return console.log('Connected to github-connector.');
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});