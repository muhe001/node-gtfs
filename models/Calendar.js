var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var CalendarSchema = mongoose.Schema(require('./_calendar'));

module.exports = function (esClient) {
  
  if (esClient) {

    CalendarSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Calendar', CalendarSchema);
};