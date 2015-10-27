var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var CalendarDateSchema = mongoose.Schema(require('./_calendarDate'));

module.exports = function (esClient) {
  
  if (esClient) {

    CalendarDateSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('CalendarDate', CalendarDateSchema);
};