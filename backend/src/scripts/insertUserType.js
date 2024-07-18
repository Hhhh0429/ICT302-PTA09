// src/scripts/insertUserTypes.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const UserType = require('../models/UserType');

mongoose.connect(process.env.MDB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  const userTypes = [
    { typeName: 'admin' },
    { typeName: 'staff'},
    { typeName: 'user' }
  ];

  try {
    await UserType.insertMany(userTypes);
    console.log('User types inserted');
  } catch (error) {
    console.error('Error inserting user types:', error);
  } finally {
    mongoose.disconnect();
  }
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
