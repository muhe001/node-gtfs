var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var FeedInfoSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  feed_publisher_name: {
    type: String,
    es_indexed: true
  },
  feed_publisher_url: {
    type: String
  },
  feed_lang: {
    type: String
  },
  feed_start_date: {
    type: String
  },
  feed_end_date: {
    type: String
  },
  feed_version: {
    type: String
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {
    
    FeedInfoSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('FeedInfo', FeedInfoSchema);
};