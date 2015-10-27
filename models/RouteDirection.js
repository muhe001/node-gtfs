var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var RouteDirectionSchema = mongoose.Schema(require('./_routeDirection.js'));

module.exports = function (esClient) {
  
  if (esClient) {

    RouteDirectionSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('RouteDirection', RouteDirectionSchema);
};