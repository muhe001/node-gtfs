var utils = require('../lib/utils');

module.exports = {
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
};