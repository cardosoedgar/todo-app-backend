var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.set('models', require('./models'));

var router = require('./routes')(app);
app.use('/todo/api', router);

app.listen(port);
console.log('running at port: ' + port);
exports = module.exports = app;
