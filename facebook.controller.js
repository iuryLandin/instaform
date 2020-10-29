'use strict';
var _ = require('lodash');
var fb = require('fb');
fb.setAccessToken('acces_token');
var getResponseAPI = require('getresponse-nodejs-api')('API_KEY');

// Confirmar token utilizado
exports.index = function(req, res) {
    console.log(req.query);
    var challenge = req.query['hub.challenge'],
        verify_token = req.query['hub.verify_token'];
    if (verify_token === 'YOUR_TOKEN') {
        res.send(challenge);
    }
};




exports.webhook = function(req, res) {
    var leadName, leadEmail;
    // Info do lead
    var fbChanges = req.body.entry[0].changes;
    var getLeadFromFacebook = new Promise(function(resolve, reject) {
        if (fbChanges !== undefined) {
            fbChanges.forEach(function(item, index) {
                //You need to retrieve the User info from the changes because Facebook Just gives you UID
                var getUserInfoFromGraph = new Promise(
                    function(resolve, reject) {
                        var leadId = item.value.leadgen_id;
                        fb.api(leadId.toString(), function(res) {
                            if (!res || res.error) {
                                console.log(!res ? 'error occurred' : res.error);
                                reject(res.error);
                            }
                            resolve(res);
                        });

                    }
                );
                getUserInfoFromGraph.then(function(userInfo) {
                    //To give you a picture the content of the data
                    console.log(JSON.stringify(userInfo.field_data));
                    userInfo.field_data.forEach(function(item) {
                        if (item.name === 'full_name') {
                            leadName = item.values[0];
                        } else if (item.name === 'email') {
                            leadEmail = item.values[0];
                        }
                    });
                }).then(function(leadInfo) {
                    //Work with info here I'm using getResponse :)
                    getResponseAPI.addContact('CAMPAIGN_ID', leadName, leadEmail, null, 0, {}, function(response) {
                        if (response.data.error) {
                            console.log('Error' + response.data.error.message);
                        }
                        console.log(JSON.stringify(response));
                    });

                });
            });
        } else {
            res.status(400);
        }
    });
};