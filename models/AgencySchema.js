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
    type: String,
    es_indexed: true
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
});

AgencySchema.plugin(AgencySchema);

module.exports = AgencySchema;