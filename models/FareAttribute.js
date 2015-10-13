var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FareAttributeSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  fare_id: {
    type: String
  },
  price: {
    type: String
  },
  currency_type: {
    type: String
  },
  payment_method: {
    type: String
  },
  transfers: {
    type: String
  },
  transfer_duration: {
    type: String
  }
});

module.exports = function (esClient) {
  
  if (esClient) {
    
    FareAttributeSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FareAttribute', FareAttributeSchema);
};