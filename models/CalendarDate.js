var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var CalendarDateSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  service_id: {
    type: String
  },
  date: {
    type: Number
  },
  exception_type: {
    type: Number,
    min: 1,
    max: 2
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    CalendarDateSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('CalendarDate', CalendarDateSchema);
};