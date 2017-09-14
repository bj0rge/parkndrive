'use strict';

var loopback = require('loopback');
var LoopbackContext = require('loopback-context');
var boot = require('loopback-boot');

var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

var app = module.exports = loopback();

// Views engine
app.middleware('initial', bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing

// Serve views
app.set('views', path.resolve(__dirname, 'views'));

// Mount static files
app.use(loopback.static(path.resolve(__dirname, '../client/public')));

// Use session
app.use(session({
  secret: 'c8e330fe957ca908sdfipooy848eeeebd474bae5',
  resave: false,
  saveUninitialized: false,
}));

// Add to provide access to the API
app.use(loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me',
}));

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};



// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
