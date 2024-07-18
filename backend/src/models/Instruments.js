// models/Instrument.js
// models/Instrument.js
const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  instrumentID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  instrumentName: { type: String, required: true },
  classID: { type: mongoose.Schema.Types.ObjectId, ref: 'InstrumentClass', required: true },
  fileURL: { type: String, required: true },  // URL to the file
  Owner: { type: String, required: true },  // Owner of the instrument
  firstCreatedDate: { type: Date, default: null },
  lastModifiedDate: { type: Date, default: null },
  nextReviewDate: { type: Date, default: null },
  associatedInstruments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }],
  accessRoles: { type: [String], required: true },  // Array of roles that can access the instrument
  keywords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KeywordSearch' }],  // Array of keyword references
  layout: { type: String, enum: ['new', 'old'], required: true },  // Layout field with "new" or "old" values
  version: { type: Number, required: true }  // Version of the instrument
});

module.exports = mongoose.model('Instrument', instrumentSchema);


/*

// models/Instrument.js
const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  instrumentID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  instrumentName: { type: String, required: true },
  classID: { type: mongoose.Schema.Types.ObjectId, ref: 'InstrumentClass', required: true },
  fileURL: { type: String, required: true },  // URL to the file
  Owner: { type: String, required: true },  // Owner of the instrument
  firstCreatedDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  nextReviewDate: { type: Date, required: true },
  associatedInstruments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }],
  accessRoles: { type: [String], required: true },  // Array of roles that can access the instrument
  keywords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KeywordSearch' }],  // Array of keyword references
  layout: { type: String, enum: ['new', 'old'], required: true },  // Layout field with "new" or "old" values
  version: { type: Number, required: true }  // Version of the instrument
});

module.exports = mongoose.model('Instrument', instrumentSchema);


// models/Instrument.js
const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  instrumentID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  instrumentName: { type: String, required: true },
  classID: { type: mongoose.Schema.Types.ObjectId, ref: 'InstrumentClass', required: true },
  fileURL: { type: String, required: true },  // URL to the file
  fileName: { type: String, required: true },  // Name of the file
  Owner: { type: String, required: true },  // Owner of the instrument
  firstCreatedDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  nextReviewDate: { type: Date, required: true },
  associatedInstruments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instrument' }],
  accessRoles: { type: [String], required: true },  // Array of roles that can access the instrument
  keywords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KeywordSearch' }],  // Array of keyword references
  layout: { type: String, enum: ['new', 'old'], required: true }  // Layout field with "new" or "old" values
});

module.exports = mongoose.model('Instrument', instrumentSchema);





old version

const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  instrumentID: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  instrumentName: { type: String, required: true },
  classID: { type: mongoose.Schema.Types.ObjectId, ref: 'InstrumentClass' },
  fileURL: { type: String, required: true },  // URL to the file
  fileName: { type: String, required: true },  // Name of the file
  firstCreatedDate: { type: Date, required: true },
  lastModifiedDate: { type: Date, required: true },
  accessRoles: { type: [String], required: true }  // Array of roles that can access the instrument
});

module.exports = mongoose.model('Instrument', instrumentSchema);

*/