var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var RouteSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  route_id: {
    type: String
  },
  agency_id: {
    type: String
  },
  route_short_name: {
    type: String
  },
  route_long_name: {
    type: String
  },
  route_desc: {
    type: String
  },
  route_type: {
    type: String
  },
  route_url: {
    type: String
  },
  route_color: {
    type: String
  },
  route_text_color: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {
    
    RouteSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Route', RouteSchema);
};