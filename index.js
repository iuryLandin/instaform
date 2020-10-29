var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var controller = require('./facebook.controller');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

var token = process.env.TOKEN || 'token102030';
var received_updates = [];

app.get('/', controller.index);
app.post('/', controller.webhook);

app.listen();