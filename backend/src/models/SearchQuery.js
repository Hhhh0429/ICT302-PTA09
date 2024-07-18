// models/SearchQuery.js
const mongoose = require('mongoose');

const searchQuerySchema = new mongoose.Schema({
  queryID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  queryText: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdDate: { type: Date, default: Date.now }  // Automatically add a timestamp for when the query was made
});

module.exports = mongoose.model('SearchQuery', searchQuerySchema);
