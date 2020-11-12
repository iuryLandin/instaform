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

app.get(['/facebook', '/instagram'], function(req, res) {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

app.post('/facebook', async function(req, res) {
    console.log(JSON.stringify(req.body));

    var app_token = '273565973982869|mA9Tj_TrYF_RYsGtYmygHRZDKj4';
    var leadgen_id = req.body.object.entry[0].changes[0].value.leadgen_id;

    await fetch(`"https://graph.facebook.com/v8.0/${leadgen_id}?access_token=${app_token}`)
        .then(resultado => {
            console.log(resultado.data)
        });

    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
    console.log('Instagram request body:');
    console.log(req.body);
    // Process the Instagram updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});

app.listen();