// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Student', studentSchema);
