// models/InstrumentVersion.js
const mongoose = require('mongoose');

const instrumentVersionSchema = new mongoose.Schema({
  versionID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  fileName: { type: String, required: true },
  firstCreatedDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  instrumentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }
});

module.exports = mongoose.model('InstrumentVersion', instrumentVersionSchema);
