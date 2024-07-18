// models/UserType.js
const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
  typeID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  typeName: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('UserType', userTypeSchema);
