 var express = require('express');
 const API = require('./leads');

 var app = express();
 const API = require('./leads')

 app.set('port', (process.env.PORT || 5000));
 app.listen(app.get('port'));

 app.use(
     express.urlencoded({
         extended: true
     })
 )

 app.get('/', function(req, res) {
     API({
         token: req.body.token,
         formId: req.body.formId,
     }, function(resultado) {
         res.send(resultado);
         console.log(resultado)
     });

 });