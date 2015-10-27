var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FeedInfoSchema = mongoose.Schema(require('./_feedInfo'));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FeedInfoSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FeedInfo', FeedInfoSchema);
};