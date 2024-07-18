// models/UserCredentials.js
const mongoose = require('mongoose');

const userCredentialsSchema = new mongoose.Schema({
  credentialID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('UserCredentials', userCredentialsSchema);
