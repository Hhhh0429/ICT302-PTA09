// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userTypeID: { type: mongoose.Schema.Types.ObjectId, ref: 'UserType', required: true },
  role: { type: String, required: true },
  username: { type: String, required: true, unique: true } // Add this field
});

module.exports = mongoose.model('User', userSchema);
