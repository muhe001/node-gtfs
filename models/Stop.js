var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var StopSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  stop_id: {
    type: String,
    index: true
  },
  stop_code: {
    type: String
  },
  stop_name: {
    type: String,
    es_indexed: true
  },
  stop_desc: {
    type: String,
    es_indexed: true
  },
  stop_lat: {
    type: Number
  },
  stop_lon: {
    type: Number
  },
  loc: {
    type: Array,
    index: '2d'
  },
  zone_id: {
    type: String
  },
  stop_url: {
    type: String
  },
  location_type: {
    type: String
  },
  parent_station: {
    type: String
  },
  stop_timezone: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    StopSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Stop', StopSchema);
};