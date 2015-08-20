var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('models', require('./models'));
app.set('Utils', require('./Utils'));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
  next();
});

var middleware = require('./validateRequest')(app);
app.all('/api/*', middleware);

var router = require('./routes')(app);
app.use('/', router);

app.listen(port);
console.log('running at port: ' + port);
exports = module.exports = app;
