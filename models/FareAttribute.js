var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FareAttributeSchema = mongoose.Schema(require('./_fareAttribute'));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FareAttributeSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FareAttribute', FareAttributeSchema);
};