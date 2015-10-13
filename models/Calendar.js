var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var CalendarSchema = mongoose.Schema({
  agency_key: {
    type: String,
    index: true
  },
  service_id: {
    type: String
  },
  monday: {
    type: Number,
    min: 0,
    max: 1
  },
  tuesday: {
    type: Number,
    min: 0,
    max: 1
  },
  wednesday: {
    type: Number,
    min: 0,
    max: 1
  },
  thursday: {
    type: Number,
    min: 0,
    max: 1
  },
  friday: {
    type: Number,
    min: 0,
    max: 1
  },
  saturday: {
    type: Number,
    min: 0,
    max: 1
  },
  sunday: {
    type: Number,
    min: 0,
    max: 1
  },
  start_date: {
    type: Number
  },
  end_date: {
    type: Number
  }
}));

module.exports = function (esClient) {
  
  if (esClient) {

    CalendarSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Calendar', CalendarSchema);
};