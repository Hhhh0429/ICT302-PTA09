// models/SysAdmin.js
const mongoose = require('mongoose');

const sysAdminSchema = new mongoose.Schema({
  adminID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
});

module.exports = mongoose.model('SysAdmin', sysAdminSchema);
