// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  timestamp: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instrumentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }
});

module.exports = mongoose.model('Transaction', transactionSchema);
