var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FareRuleSchema = mongoose.Schema(require('./_fareRule'));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FareRuleSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FareRule', FareRuleSchema);
};