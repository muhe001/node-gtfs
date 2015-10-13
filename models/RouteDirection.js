var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var RouteDirectionSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  route_id: {
    type: String
  },
  route_name: {
    type: String
  },
  direction_id: {
    type: Number,
    index: true,
    min: 0,
    max: 1
  },
  direction_name: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    RouteDirectionSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('RouteDirection', RouteDirectionSchema);
};