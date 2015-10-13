var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var TripSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  route_id: {
    type: String,
    index: true
  },
  service_id: {
    type: String,
    index: true
  },
  trip_id: {
    type: String
  },
  trip_headsign: {
    type: String
  },
  trip_short_name: {
    type: String
  },
  direction_id: {
    type: Number,
    index: true,
    min: 0,
    max: 1
  },
  block_id: {
    type: String
  },
  shape_id: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    TripSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Trip', TripSchema);
};