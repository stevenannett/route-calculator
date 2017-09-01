// app/index.js
"use strict";

const routeCalc = require('./route-calc');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use( bodyParser.json() );

const routeRequests = {};

app.listen(80, function () {
  console.log('App listening on port 80');
});

app.post('/route', function (req, res) {
	let token = crypto.randomBytes(18).toString('hex');
    setImmediate ( function() {
		let origin = req.body[0];
		let destinations = req.body.slice(1);
		let routeRequest = {
			token: token,
			origin: origin,
			destinations: destinations
		};

        /* Add the request to the map*/
		routeRequests[token] = routeRequests[token] || [];
		routeRequests[token].push(routeRequest);
		
		routeCalc.calculateShortestRoute(routeRequest, resultCallback);

		/* Remove the request from the map after an hour */
		setTimeout (function () {
            delete routeRequests[token];
        }, 3600000);
	});
	console.log('Received route request, responding with token ' + token);
	res.json({token:token});
});


const resultCallback = function(err, token, result) {
  if (err) {
      routeRequests[token].status = "failure";
      routeRequests[token].error = err;
  }
  routeRequests[token].result = result;
  console.log('Finished calculating result for request ' + token + ': ' + JSON.stringify(result));
};


app.get('/route/:tokenid', function (req, res) {
	let tokenId = req.params.tokenid;

	let result;
	let originalRequest = routeRequests[tokenId];
	if (!originalRequest) {
		result = {status:"failure", error:'Request token ' + tokenId + ' not found'};
	} else if (originalRequest.error) {
        result = {status:"failure", error:originalRequest.error};
	} else if (!originalRequest.result) {
        result = {status:"in progress"};
	} else {
        result = originalRequest.result;
	}

	console.log('Received route update request for ' + tokenId + ', returning: ' + JSON.stringify(result));
    res.json((result));
});