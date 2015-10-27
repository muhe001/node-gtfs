var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var TransferSchema = mongoose.Schema(require('./_transfer.js'));

module.exports = function (esClient) {
  
  if (esClient) {

    TransferSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Transfer', TransferSchema);
};