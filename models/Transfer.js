var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var TransferSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  from_stop_id: {
    type: String
  },
  to_stop_id: {
    type: String
  },
  transfer_type: {
    type: String
  },
  min_transfer_time: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    TransferSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Transfer', TransferSchema);
};