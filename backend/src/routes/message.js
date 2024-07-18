const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const natural = require('natural');
const Instrument = require('../models/Instruments');
const KeywordSearch = require('../models/KeywordSearch');
const SearchQuery = require('../models/SearchQuery');

// NLP Chatbot
const classifier = new natural.BayesClassifier();

classifier.addDocument('I need information about assessments', 'assessment');
classifier.addDocument('What are the responsibilities of a role?', 'role');
classifier.addDocument('Which documents need updating?', 'layout');
classifier.addDocument('Find related policies', 'related');
classifier.addDocument('How many classes are in the policy instruments?', 'class_count');
classifier.addDocument('Search for instruments', 'search');
classifier.addDocument('Im looking for specific policies', 'search');
classifier.addDocument('Can you find information about', 'search');
classifier.addDocument('Check for instruments related to', 'search');
classifier.addDocument('I am looking for','search');


classifier.train();

// Helper function to get NLP response
async function getNLPResponse(category, text, userId) {
  // Helper function to save search query
  const saveSearchQuery = async () => {
    await new SearchQuery({
      queryText: text,
      userID: userId
    }).save();
  };

  switch(category) {
    case 'role':
      await saveSearchQuery();
      const roleMatch = text.match(/responsibilities of (\w+) role/);
      const role = roleMatch ? roleMatch[1] : '';
      const roleInstruments = await Instrument.find({ accessRoles: role });
      return {
        text: `The ${role} role is associated with these instruments: ${roleInstruments.map(i => i.instrumentName).join(', ')}`,
        instruments: roleInstruments.map(i => ({ id: i._id, name: i.instrumentName }))
      };
    
    case 'layout':
      await saveSearchQuery();
      const outdatedInstruments = await Instrument.find({ layout: { $ne: 'New' } });
      return {
        text: `These documents need updating: ${outdatedInstruments.map(i => i.instrumentName).join(', ')}`,
        instruments: outdatedInstruments.map(i => ({ id: i._id, name: i.instrumentName }))
      };
    
    case 'related':
      await saveSearchQuery();
      return {
        text: "To find related policies, please use our advanced search feature.",
        instruments: []
      };

      case 'class_count':
        await saveSearchQuery();
        const totalClasses = await Instrument.distinct('class').count();
        return {
          text: `There are ${totalClasses} classes in total within our policy instruments.`,
          instruments: [] // We're not returning any specific instruments for this query
        };

      case 'search':
        await saveSearchQuery();
        const searchTerms = text.toLowerCase().split(' ');
        const relevantInstruments = await Instrument.find({
          $or: [
            { instrumentName: { $regex: searchTerms.join('|'), $options: 'i' } },
            { description: { $regex: searchTerms.join('|'), $options: 'i' } }
          ]
        }).populate('keywords');
    
        const filteredInstruments = relevantInstruments.filter(instrument => 
          instrument.keywords.some(keyword => 
            searchTerms.includes(keyword.keywordText.toLowerCase())
          )
        );
    
        const result = filteredInstruments.length > 0 ? filteredInstruments : relevantInstruments;
    
        return result.length > 0 
          ? {
              text: "I found these relevant instruments:",
              instruments: result.map(i => ({ id: i._id, name: i.instrumentName }))
            }
          : { text: "I couldn't find any instruments matching your search. Please try different keywords." };
  
          default:
            return {
              text: "I'm sorry, I couldn't understand your query. Could you please rephrase it?",
              instruments: []
            };
    }
  }

// Routes
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In routes/message.js

router.post('/', async (req, res) => {
  const { text, userId } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const category = classifier.classify(text);
    const response = await getNLPResponse(category, text, userId);

    // Save message and response
    const message = new Message({
      text,
      response: {
        text: response.text,
        instruments: response.instruments || []
      }
    });
    const newMessage = await message.save();

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
});

module.exports = router;