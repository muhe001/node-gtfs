var mongoose = require('mongoose');
var utils = require('../lib/utils');
var mongoosastic = require('mongoosastic');

var StopTimeSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  trip_id: {
    type: String,
    index: true
  },
  arrival_time: {
    type: String,
    get: utils.secondsToTime,
    set: utils.timeToSeconds
  },
  departure_time: {
    type: String,
    index: true,
    get: utils.secondsToTime,
    set: utils.timeToSeconds
  },
  stop_id: {
    type: String,
    index: true
  },
  stop_sequence: {
    type: Number,
    index: true
  },
  stop_headsign: {
    type: String
  },
  pickup_type: {
    type: Number
  },
  drop_off_type: {
    type: String
  },
  shape_dist_traveled: {
    type: String
  }
});

module.exports = function (esClient) {
  
  if (esClient) {

    StopTimeSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('StopTime', StopTimeSchema);
};