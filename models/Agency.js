var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var AgencySchema = require('./AgencySchema');

module.exports = function (esClient) {
  
  if (esClient) {

    AgencySchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Agency', AgencySchema);
};