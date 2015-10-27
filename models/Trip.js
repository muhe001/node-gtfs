var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var TripSchema = mongoose.Schema(require('./_trip'));

module.exports = function (esClient) {
  
  if (esClient) {

    TripSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Trip', TripSchema);
};