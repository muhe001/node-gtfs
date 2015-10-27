var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var StopSchema = mongoose.Schema(require('./_stop'));

module.exports = function (esClient) {
  
  if (esClient) {

    StopSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Stop', StopSchema);
};