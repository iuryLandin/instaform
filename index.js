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

app.post('/facebook', async function(req, res) {

    const headers = { "content-type": "application/json", "accept": "application/json" };

    // token de produção do app
    var app_token = '273565973982869|mA9Tj_TrYF_RYsGtYmygHRZDKj4';

    var long_lived_token = 'EAAD4zoqzrpUBABQBLkcHr0DuJ2O4ARzDEeyl28qUKO65V50NHd24fjVg7lZCHCUieShakzfAO7kAYqA4UV41PqPanBKYDdPgUUXRwsXQaS2SZBWnFA4YkqjCYb1oxbqVTUS6k3stGuIbsNUU80BjcS8wf0iZCMjnomxbvj3ns06LFM8Q3J4jVukmMt4td8ZD';

    //declara variavel com id do lead recebido
    var leadgen_id = req.body.entry[0].changes[0].value.leadgen_id;

    console.log(leadgen_id);

    //faz uma requisição no facebook para pegar os dados do formulario do lead
    // no momento não funciona pelo fato em que precisa do token com permissão
    var f = await fetch(`https://graph.facebook.com/v8.0/${leadgen_id}?access_token=${long_lived_token}`, { method: 'GET', headers }).then(resp => resp.json())

    console.log(f);

    let nome;
    let email;
    let phone;

    for (let i = 0; i < f.field_data.length; i++) {
        let aux = f.field_data;
        if (aux[i].name === "email") {
            email = aux[i].values[0];
        } else if (aux[i].name === "full_name") {
            nome = aux[i].values[0];
        } else if (aux[i].name === "phone_number") {
            phone = aux[i].values[0];
        }
    }
    console.log("\nNome: " + nome);
    console.log("\nEmail: " + email);
    console.log("\nPhone: " + phone);


    var crm_url = `https://crm.inorte.com.br/lead_api/LeadApi/add?nome=${nome}&email=${email}&phone=${phone}`;

    var send_to_crm = await fetch(crm_url).then(resp => resp.json())


    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});


app.listen();