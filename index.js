/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
const fetch = require('node-fetch');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

var token = process.env.TOKEN || 'token102030';
var received_updates = [];

app.get('/', function(req, res) {
    console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get('/facebook', function(req, res) {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

app.post('/facebook', function(req, res) {


    // token de produção do app
    var app_token = 'add_token Aqui';

    //declara variavel com id do lead recebido
    var leadgen_id = req.body.entry[0].changes[0].value.leadgen_id;

    //faz uma requisição no facebook para pegar os dados do formulario do lead
    // no momento não funciona pelo fato em que precisa do token com permissão
    fetch(`https://graph.facebook.com/v8.0/${leadgen_id}?access_token=${app_token}`)
        .then(resultado => {
            console.log(resultado)
        }).catch(err => console.error(err));


    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});


app.listen();