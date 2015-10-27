var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var RouteSchema = mongoose.Schema(require('./_route'));

module.exports = function (esClient) {
  
  if (esClient) {
    
    RouteSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Route', RouteSchema);
};