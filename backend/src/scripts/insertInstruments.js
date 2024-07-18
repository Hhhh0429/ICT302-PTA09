// src/scripts/insertInstruments.js
// src/scripts/insertInstruments.js
require('dotenv').config({ path: '../.env' }); // Adjust the path to .env
const mongoose = require('mongoose');
const fs = require('fs');
const Instrument = require('../models/Instruments');
const InstrumentClass = require('../models/InstrumentClass');
const KeywordSearch = require('../models/KeywordSearch');

mongoose.connect(process.env.MDB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // Fetch all instrument classes
  const instrumentClasses = await InstrumentClass.find();
  const classMap = instrumentClasses.reduce((map, cls) => {
    map[cls.className] = cls._id;
    return map;
  }, {});

  // Read and parse JSON data
  const instrumentsData = JSON.parse(fs.readFileSync('./instruments4July.json', 'utf8'));

  // First pass: Insert all instruments without associations
const instrumentsToInsert = instrumentsData.map(instrument => ({
  instrumentName: instrument.instrumentName,
  classID: classMap[instrument.className],
  fileURL: instrument.fileURL,
  Owner: instrument.Owner,
  firstCreatedDate: instrument.firstCreatedDate ? new Date(instrument.firstCreatedDate) : null,
  lastModifiedDate: instrument.lastModifiedDate ? new Date(instrument.lastModifiedDate) : null,
  nextReviewDate: instrument.nextReviewDate ? new Date(instrument.nextReviewDate) : null,
  associatedInstruments: [], // Temporarily empty
  accessRoles: instrument.accessRoles,
  layout: instrument.layout.toLowerCase(),  // Ensure layout is lowercase
  version: instrument.version
}));

  try {
    // Insert instruments into the database
    const insertedInstruments = await Instrument.insertMany(instrumentsToInsert);

    // Create a map of instrument names to their new IDs
    const newInstrumentMap = insertedInstruments.reduce((map, instrument) => {
      map[instrument.instrumentName] = instrument._id;
      return map;
    }, {});

// Second pass: Update instruments with correct associations
for (const instrument of instrumentsData) {
  const instrumentId = newInstrumentMap[instrument.instrumentName];
  const associatedIds = instrument.associatedInstruments
    .map(name => {
      // Trim whitespace from the instrument name
      const trimmedName = name.trim();
      const id = newInstrumentMap[trimmedName];
      if (!id) {
        console.warn(`Associated instrument not found: "${trimmedName}" for "${instrument.instrumentName}"`);
      }
      return id;
    })
    .filter(id => id); // Remove any undefined entries

  if (associatedIds.length !== instrument.associatedInstruments.length) {
    console.warn(`Some associated instruments were not found for "${instrument.instrumentName}"`);
  }

  await Instrument.findByIdAndUpdate(instrumentId, {
    associatedInstruments: associatedIds
  });

      // Insert keywords and update instruments with keyword references
      const keywordDocs = await Promise.all(
        instrument.keywords.map(async keyword => {
          const keywordDoc = new KeywordSearch({ keywordText: keyword, instrumentID: instrumentId });
          return await keywordDoc.save();
        })
      );

      await Instrument.findByIdAndUpdate(instrumentId, { keywords: keywordDocs.map(doc => doc._id) });
    }

    console.log('Instruments, associations, and keywords inserted successfully');
  } catch (error) {
    console.error('Error inserting instruments:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});



/*

// src/scripts/insertInstruments.js
require('dotenv').config({ path: '../.env' }); // Adjust the path to .env
const mongoose = require('mongoose');
const fs = require('fs');
const Instrument = require('../models/Instrument');
const InstrumentClass = require('../models/InstrumentClass');
const KeywordSearch = require('../models/KeywordSearch');

mongoose.connect(process.env.MDB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // Fetch all instrument classes
  const instrumentClasses = await InstrumentClass.find();
  const classMap = instrumentClasses.reduce((map, cls) => {
    map[cls.className] = cls._id;
    return map;
  }, {});

  // Fetch all existing instruments for association
  const allInstruments = await Instrument.find();
  const instrumentMap = allInstruments.reduce((map, instrument) => {
    map[instrument.instrumentName] = instrument._id;
    return map;
  }, {});

  // Read and parse JSON data
  const instrumentsData = JSON.parse(fs.readFileSync('./instruments.json', 'utf8'));

  // Map data to instruments schema
  const instruments = instrumentsData.map(instrument => ({
    instrumentName: instrument.instrumentName,
    classID: classMap[instrument.className],
    fileURL: instrument.fileURL,
    fileName: instrument.fileName,
    Owner: instrument.Owner,
    firstCreatedDate: new Date(instrument.firstCreatedDate),
    lastModifiedDate: new Date(instrument.lastModifiedDate),
    nextReviewDate: new Date(instrument.nextReviewDate),
    associatedInstruments: instrument.associatedInstruments.map(name => instrumentMap[name] || null).filter(id => id),
    accessRoles: instrument.accessRoles,
    layout: instrument.layout
  }));

  try {
    // Insert instruments into the database
    const insertedInstruments = await Instrument.insertMany(instruments);

    // Insert keywords and update instruments with keyword references
    for (const instrument of instrumentsData) {
      const instrumentId = insertedInstruments.find(i => i.instrumentName === instrument.instrumentName)._id;

      const keywordDocs = await Promise.all(
        instrument.keywords.map(async keyword => {
          const keywordDoc = new KeywordSearch({ keywordText: keyword, instrumentID: instrumentId });
          return await keywordDoc.save();
        })
      );

      await Instrument.findByIdAndUpdate(instrumentId, { keywords: keywordDocs.map(doc => doc._id) });
    }

    console.log('Instruments and keywords inserted successfully');
  } catch (error) {
    console.error('Error inserting instruments:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});


*/