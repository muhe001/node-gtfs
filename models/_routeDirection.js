module.exports = {
  agency_key: {
    type: String,
    index: true
  },
  route_id: {
    type: String
  },
  route_name: {
    type: String
  },
  direction_id: {
    type: Number,
    index: true,
    min: 0,
    max: 1
  },
  direction_name: {
    type: String
  }
};