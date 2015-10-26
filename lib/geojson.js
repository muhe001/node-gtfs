'use strict';

var fs = require('fs');

var mongoose = require('mongoose');
var mongooseDb = mongoose.connect('mongodb://localhost:27017/gtfs');

var async = require('async');

var Stop = require('../models/Stop')();

//module.exports = function () {
	console.log('asd');
	Stop.find({}, function (err, stops) {
		if (err) {
			return console.log(err);
		}
		console.log('ff');

		var GeoJsonObj = {
			type: 'FeatureCollection',
			features: []
		};

		stops.forEach(function (stop) {
			GeoJsonObj.features.push({
				type: 'Feature',
				properties: {
					stop_id: stop.stop_id,
					stop_name: stop.stop_name,
					stop_lat: stop.stop_lat,
					stop_lon: stop.stop_lon
				},
				geometry: {
					type: 'Point',
					coordinates: [stop.stop_lon, stop.stop_lat]
				}
			})
		});

		fs.writeFile(__dirname + '/../downloads/stops.geojson', JSON.stringify(GeoJsonObj, null, 4));
	});
//};

console.log('AA');

/*var Route = require('../models/Route')();
var Trip = require('../models/Trip')();
var Shape = require('../models/Shape')();

Route.find({}, function (err, routes) {
	if (err) {
		return console.log(err);
	}

	var GeoJsonObj = {
		type: 'FeatureCollection',
		features: []
	};

	routes.forEach(function (route) {

		var Feature = {
			type: 'Feature',
			properties: {
				route_id: route.route_id,
				route_short_name: route.route_short_name
			},
			geometry: {
				type: 'MultiLineString',
				coordinates: []
			}
		});

		var shapeIds = [];
		
		Trip.find({
			route_id: route.route_id
		}, function (err, trips) {
			if (err) {
				return console.log(err);
			}

			trips.forEach(function (trip) {
				

				if (shapeIds.indexOf(trip.shape_id) === -1) {
					shapeIds.push(trip.shape_id);
				}
			});

			//console.log('Route: ' + route.route_short_name);
			//console.log('shapes: ' + shapeIds);

			Shape.find({
				shape_id: {
					$in: shapeIds
				}
			}, function (err, shapes) {
				if (err) {
					return console.log(err);
				}

				if (!shapes) {
					console.log('**');
				}

				var line = [];

				shapes.forEach(function (shape) {
					console.log('Route: ' + route.route_short_name);
					console.log('shape: ' + shape.shape_id);

					line.push([shape.shape_pt_lon, shape.shape_pt_lat]);
				});

				Feature.geometry.coordinates.push(line);

				GeoJsonObj.features.push(Feature);
			});
		});
	});
});*/

/*var Shape = require('../models/Shape')();
console.log('aa');

Shape.find().distinct('shape_id', function(err, shape_ids) {
	if (err) {
		return console.log(err);
	}

	console.log(shape_ids);

	var GeoJsonObj = {
		type: 'FeatureCollection',
		features: []
	};

	async.eachLimit(shape_ids, 100, function (shape_id, cb) {

		Shape.find({shape_id: shape_id}, function (err, shapes) {
			if (err) {
				return next(cb);
			}

			//var coordinates = ;

			process.stdout.write('.');

			GeoJsonObj.features.push({
				type: 'Feature',
				properties: {
					shape_id: shape_id
				},
				geometry: {
					type: 'LineString',
					coordinates: shapes.sort(function (a, b) {
						return b.shape_pt_sequence - a.shape_pt_sequence;
					}).map(function (shape) {
						return [shape.shape_pt_lon, shape.shape_pt_lat]
					})
				}
			});

			cb(null);
		});
	}, function (err) {

		if (err) {
			return console.log(err);
		}

		fs.writeFile(__dirname + '/../downloads/shapes.geojson', JSON.stringify(GeoJsonObj, null, 4));
	});
});*/

/*Shape.find({}, function (err, shapes) {
	console.log('bb');

	if (err) {
		return console.log(err);
	}

	var GeoJsonObj = {
		type: 'FeatureCollection',
		features: []
	};

	var ShapeById = {}

	shapes.forEach(function (shape) {

		console.log(shape.shape_id);

		if (!ShapeById[shape.shape_id]) {
			ShapeById[shape.shape_id] = {
				coordinates: []
			}
		}

		ShapeById[shape.shape_id].coordinates.push([shape.shape_pt_lon, shape.shape_pt_lat]);
	});

	ShapeById.forEach(function (shp) {
		console.log(shp);
	});

	console.log('END')
})*/