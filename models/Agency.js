var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var AgencySchema = mongoose.Schema(require('./_agency'));

module.exports = function (esClient) {
  
  if (esClient) {

    AgencySchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Agency', AgencySchema);
};