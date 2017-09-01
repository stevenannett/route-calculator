// app/route-calc.js
"use strict";

module.exports.calculateShortestRoute = calculateShortestRoute;

const async = require('async');

/* Google's own NodeJS wrapper */
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCtFB7J5iFNgc9MwRDwTZGTimJNKDvRoxc'
});

function calculateShortestRoute(routeRequest, resultCallback) {

	/* Set up the result object */
    let routeResult = {
        status: "in progress",
        tempDestinations: [...routeRequest.destinations],
        path: [routeRequest.origin],
        total_distance: 0,
        total_time: 0
    }

    /* Convert the lat & lon into strings ready for Google*/
	let originString = asString(routeRequest.origin[0], routeRequest.origin[1]);
	let destinationStrings = [];
	routeRequest.destinations.forEach(destination => {
		destinationStrings.push(asString(destination[0], destination[1]));
    });

    /* Reiterate over route finding shortest path */
    buildShortestRoute(originString, destinationStrings, routeRequest.token, resultCallback, routeResult);
}

function asString(lat, lon) {
	return lat+','+lon;
}


async function buildShortestRoute(originString, destinationStrings, token, resultCallback, routeResult ) {
	let nearestDestinationResult = await locateNearestDestination(originString, destinationStrings).catch((err) => {
        resultCallback(err, token, routeResult);
    });

	/* Add the nearest destination to results object */
	let nearestDestinationString = destinationStrings[nearestDestinationResult.index];
	routeResult.total_distance += nearestDestinationResult.distance;
	routeResult.total_time += nearestDestinationResult.duration;
	let nextDestination = routeResult.tempDestinations.splice(nearestDestinationResult.index, 1);
	routeResult.path.push(nextDestination[0]);

    /* Remove the destination from the list and reiterate if there is more */
	destinationStrings.splice(nearestDestinationResult.index, 1);
	if (destinationStrings.length > 0) {
        buildShortestRoute(nearestDestinationString, destinationStrings, token, resultCallback, routeResult);
	} else {
		delete routeResult.tempDestinations;
		routeResult.status = "success";
		resultCallback(null, token, routeResult);
	}
}


function locateNearestDestination(originString, destinationStrings) {
	return new Promise((resolve, reject) => {
		googleMapsClient.distanceMatrix({
		  origins: [originString],
		  destinations: destinationStrings
		}, function(err, response) {
			if (err || response.json.status !== 'OK') {
				console.log("Cannot find route, please check input");
				reject("Cannot find route, please check input");
			}

			let nearestResult = {};
			nearestResult.distance = 0;
			nearestResult.duration = 0;
			nearestResult.index = -1;

			let legs = response.json.rows[0].elements;
			legs.forEach(function(leg, index) {
				 if (leg.status === 'OK') {
					 if (nearestResult.index === -1 || leg.distance.value < nearestResult.distance) {
						 nearestResult.distance = leg.distance.value;
						 nearestResult.duration = leg.duration.value;
						 nearestResult.index = index;
					 }
				 }
			});
			resolve(nearestResult);
		});
    });
}