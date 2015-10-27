var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var TimetableSchema = mongoose.Schema(require('./_timetable'));

module.exports = function (esClient) {
  
  if (esClient) {

    TimetableSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Timetable', TimetableSchema);
};