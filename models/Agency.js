var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var AgencySchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  agency_id: {
    type: String
  },
  agency_name: {
    type: String
  },
  agency_url: {
    type: String
  },
  agency_timezone: {
    type: String
  },
  agency_lang: {
    type: String
  },
  agency_phone: {
    type: String
  },
  agency_fare_url: {
    type: String
  },
  agency_bounds: {
    sw: {
      type: Array,
      index: '2d'
    },
    ne: {
      type: Array,
      index: '2d'
    }
  },
  agency_center: {
    type: Array,
    index: '2d'
  },
  date_last_updated: {
    type: Number
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    AgencySchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Agency', AgencySchema);
};