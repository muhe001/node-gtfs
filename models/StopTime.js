var mongoose = require('mongoose');

var mongoosastic = require('mongoosastic');

var StopTimeSchema = mongoose.Schema(require('./_stopTime'));

module.exports = function (esClient) {
  
  if (esClient) {

    StopTimeSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('StopTime', StopTimeSchema);
};