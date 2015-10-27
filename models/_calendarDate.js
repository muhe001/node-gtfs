module.exports = {
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
};