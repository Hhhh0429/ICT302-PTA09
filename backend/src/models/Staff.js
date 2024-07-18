// models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Staff', staffSchema);
