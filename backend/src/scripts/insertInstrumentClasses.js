// src/scripts/insertInstrumentClasses.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const InstrumentClass = require('../models/InstrumentClass');

mongoose.connect(process.env.MDB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  const instrumentClasses = [
    { className: 'Bylaw' },
    { className: 'Guideline' },
    { className: 'Code/Charter' },
    { className: 'Regulations' },
    { className: 'Principles/Framework' },
    { className: 'Policy' },
    { className: 'Procedure' },
    { className: 'Rule' },
    { className: 'Statutes' }
    // Add more classes as needed
  ];

  try {
    await InstrumentClass.insertMany(instrumentClasses);
    console.log('Instrument classes inserted');
  } catch (error) {
    console.error('Error inserting instrument classes:', error);
  } finally {
    mongoose.disconnect();
  }
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
