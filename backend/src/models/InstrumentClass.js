// models/InstrumentClass.js
const mongoose = require('mongoose');

const instrumentClassSchema = new mongoose.Schema({
  classID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  className: { type: String, required: true }
});

module.exports = mongoose.model('InstrumentClass', instrumentClassSchema);
