var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

var token = process.env.TOKEN || 'token102030';
var received_updates = [];


app.get('/', function(req, res) {
    console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
    fetch("http://cdrtechnology.com.br:5000/chat/sendmessage/556392413975", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": {
                "message": JSON.stringify(received_updates, null, 2)
            }
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

});

app.get(['/facebook', '/instagram'], function(req, res) {
    fetch("http://cdrtechnology.com.br:5000/chat/sendmessage/556392413975", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": {
                "message": JSON.stringify(req.body)
            }
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

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
    console.log('Facebook request body:', req.body);

    if (!req.isXHubValid()) {
        console.log('Warning - request header X-Hub-Signature not present or invalid');
        res.sendStatus(401);
        return;
    }

    fetch("http://cdrtechnology.com.br:5000/chat/sendmessage/556392413975", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": {
                "message": JSON.stringify(req.body)
            }
        })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

    console.log('request header X-Hub-Signature validated');
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