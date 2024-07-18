// In models/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  response: {
    text: String,
    instruments: [{
      id: mongoose.Schema.Types.ObjectId,
      name: String
    }]
  }
});

module.exports = mongoose.model('Message', MessageSchema);