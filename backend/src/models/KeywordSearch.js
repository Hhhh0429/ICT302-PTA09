// models/KeywordSearch.js
const mongoose = require('mongoose');

const keywordSearchSchema = new mongoose.Schema({
  keywordID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  keywordText: { type: String, required: true },
  instrumentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true }
});

module.exports = mongoose.model('KeywordSearch', keywordSearchSchema);
