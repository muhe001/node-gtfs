var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FrequenciesSchema = mongoose.Schema(require('./_frequencies'));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FrequenciesSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Frequencies', FrequenciesSchema);
};