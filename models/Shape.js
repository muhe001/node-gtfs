var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var ShapeSchema = mongoose.Schema(require('./_shape.js'));

module.exports = function (esClient) {
  
  if (esClient) {

    ShapeSchema.plugin(mongoosastic, {
      esClient: esClient
    });
  }

  return mongoose.model('Shape', ShapeSchema);
};