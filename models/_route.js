module.exports = {
  agency_key: {
    type: String,
    index: true
  },
  route_id: {
    type: String
  },
  agency_id: {
    type: String
  },
  route_short_name: {
    type: String,
    es_indexed: true
  },
  route_long_name: {
    type: String,
    es_indexed: true
  },
  route_desc: {
    type: String,
    es_indexed: true
  },
  route_type: {
    type: String
  },
  route_url: {
    type: String
  },
  route_color: {
    type: String
  },
  route_text_color: {
    type: String
  }
};