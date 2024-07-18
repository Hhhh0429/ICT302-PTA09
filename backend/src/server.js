require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MDB_CONNECTION_STRING, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  writeConcern: {
    w: 'majority',
    wtimeout: 5000,
  },
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Import models
const User = require('./models/User');
const UserCredentials = require('./models/UserCredentials');
const UserType = require('./models/UserType');
const Instrument = require('./models/Instruments'); // Adjust path as per your project structure
const InstrumentClass = require('./models/InstrumentClass'); // Adjust path as per your project structure
const KeywordSearch = require('./models/KeywordSearch');

// Message router
const messageRouter = require('./routes/message');

// Auth router
const authRouter = express.Router();

// Registration endpoint
authRouter.post('/register', async (req, res) => {
  const { firstName, lastName, username, password, userType } = req.body;

  if (!firstName || !lastName || !username || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('Received registration request:', { firstName, lastName, username, password, userType });

    const existingUserCredentials = await UserCredentials.findOne({ userName: username });
    if (existingUserCredentials) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const userTypeDoc = await UserType.findOne({ typeName: userType.toLowerCase() });
    if (!userTypeDoc) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const role = userType.toLowerCase();
    const user = new User({ firstName, lastName, username, userTypeID: userTypeDoc._id, role });
    const savedUser = await user.save();

    const userCredentials = new UserCredentials({ userName: username, password, userID: savedUser._id });
    await userCredentials.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login endpoint
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`Attempting login with username: ${username}`);

  try {
    const userCredentials = await UserCredentials.findOne({ userName: username });

    if (!userCredentials) {
      console.log(`Login failed: Username ${username} not found in database.`);
      return res.status(400).send('Invalid credentials');
    }

    if (password !== userCredentials.password) {
      console.log(`Login failed: Incorrect password for username ${username}.`);
      return res.status(400).send('Invalid credentials');
    }

    const user = await User.findById(userCredentials.userID);

    const token = jwt.sign(
      { userId: userCredentials.userID, firstName: user.firstName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`User logged in: ${user.firstName}, Role: ${user.role}`);
    res.send({ token, firstName: user.firstName, role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

// Logout endpoint
authRouter.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Perform logout actions
      const userId = decoded.userId;
      const user = await User.findById(userId);

      if (!user) {
        console.log(`User not found, but logged out successfully.`);
        return res.status(200).json({ message: 'User logged out successfully' });
      }

      console.log(`User logged out successfully: ${user.firstName}`);
      res.status(200).json({ message: 'User logged out successfully', firstName: user.firstName });
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Endpoint to fetch users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user endpoint
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    await UserCredentials.findOneAndDelete({ userID: id });
    console.log(`User and credentials deleted successfully: ${deletedUser.firstName}`);
    
    res.status(200).json({ message: 'User and credentials deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Endpoint to fetch instruments
app.get('/api/instruments', async (req, res) => {
  try {
    const instruments = await Instrument.find({})
      .select('instrumentName classID fileURL Owner firstCreatedDate lastModifiedDate accessRoles nextReviewDate associatedInstruments keywords layout version')
      .populate('associatedInstruments', 'instrumentName')
      .populate('classID', 'className')
      .populate('keywords');

    const formattedInstruments = await Promise.all(instruments.map(async instrument => {
      const plainInstrument = instrument.toObject();

      // Handle keywords
      let keywordTexts = [];
      if (Array.isArray(plainInstrument.keywords)) {
        keywordTexts = plainInstrument.keywords.map(k => 
          typeof k === 'string' ? k : (k.keywordText || k.toString())
        );
      } else if (plainInstrument.keywords) {
        keywordTexts = [plainInstrument.keywords.toString()];
      }

      // Handle associated instruments
      let associatedInstrumentNames = [];
      if (Array.isArray(plainInstrument.associatedInstruments)) {
        associatedInstrumentNames = plainInstrument.associatedInstruments.map(ai => 
          typeof ai === 'string' ? ai : (ai.instrumentName || ai.toString())
        );
      }

      // Handle dates
      const formatDate = (date) => date ? new Date(date).toISOString() : null;

      return {
        ...plainInstrument,
        className: plainInstrument.classID ? plainInstrument.classID.className : null,
        associatedInstruments: associatedInstrumentNames,
        keywords: keywordTexts,
        classID: plainInstrument.classID ? plainInstrument.classID._id : null,
        firstCreatedDate: formatDate(plainInstrument.firstCreatedDate),
        lastModifiedDate: formatDate(plainInstrument.lastModifiedDate),
        nextReviewDate: formatDate(plainInstrument.nextReviewDate)
      };
    }));

    res.json(formattedInstruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    res.status(500).json({ message: 'Error fetching instruments' });
  }
});

// Endpoint to fetch instrument class by ID
app.get('/api/classes/:id', async (req, res) => {
  try {
    const classData = await InstrumentClass.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
});


// Endpoint to fetch a single instrument by ID
// Endpoint to fetch a single instrument by ID
app.get('/api/instruments/:id', async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id)
      .select('instrumentName classID fileURL Owner firstCreatedDate lastModifiedDate accessRoles nextReviewDate associatedInstruments keywords layout version')
      .populate('associatedInstruments', 'instrumentName')
      .populate('classID', 'className')
      .populate('keywords');

    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }

    const plainInstrument = instrument.toObject();

    // Handle keywords
    let keywordTexts = [];
    if (Array.isArray(plainInstrument.keywords)) {
      keywordTexts = plainInstrument.keywords.map(k => 
        typeof k === 'string' ? k : (k.keywordText || k.toString())
      );
    } else if (plainInstrument.keywords) {
      keywordTexts = [plainInstrument.keywords.toString()];
    }

    // Handle associated instruments
    let associatedInstruments = [];
    if (Array.isArray(plainInstrument.associatedInstruments)) {
      associatedInstruments = plainInstrument.associatedInstruments.map(ai => ({
        _id: ai._id.toString(),
        instrumentName: ai.instrumentName
      }));
    }

    // Handle dates
    const formatDate = (date) => date ? new Date(date).toISOString() : null;

    const formattedInstrument = {
      ...plainInstrument,
      className: plainInstrument.classID ? plainInstrument.classID.className : null,
      associatedInstruments: associatedInstruments,
      keywords: keywordTexts,
      classID: plainInstrument.classID ? plainInstrument.classID._id : null,
      firstCreatedDate: formatDate(plainInstrument.firstCreatedDate),
      lastModifiedDate: formatDate(plainInstrument.lastModifiedDate),
      nextReviewDate: formatDate(plainInstrument.nextReviewDate)
    };

    res.json(formattedInstrument);
  } catch (error) {
    console.error('Error fetching instrument:', error);
    res.status(500).json({ message: 'Error fetching instrument' });
  }
});

// Use routers
app.use('/api/messages', messageRouter);
app.use('/auth', authRouter);

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const instruments = await Instrument.find({
      $or: [
        { instrumentName: { $regex: query, $options: 'i' } },
        { keywords: { $elemMatch: { $regex: query, $options: 'i' } } },
        { 'associatedInstruments.instrumentName': { $regex: query, $options: 'i' } }
      ]
    }).populate('classID', 'className');

    res.json(instruments);
  } catch (error) {
    console.error('Error searching instruments:', error);
    res.status(500).json({ message: 'Error searching instruments' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
