var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FareRuleSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  fare_id: {
    type: String
  },
  route_id: {
    type: String
  },
  origin_id: {
    type: String
  },
  destination_id: {
    type: String
  },
  contains_id: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FareRuleSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FareRule', FareRuleSchema);
};