const mongoose = require('mongoose');
const config = require('./config');
const { getCollection } = require('./store');

let isMongooseConnected = false;

async function connectDB() {
  if (config.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB via MONGODB_URI...');
      await mongoose.connect(config.MONGODB_URI, {
        serverSelectionTimeoutMS: 4000
      });
      isMongooseConnected = true;
      console.log('Connected to MongoDB database successfully.');
      return true;
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to embedded local document store:', err.message);
      isMongooseConnected = false;
    }
  } else {
    console.log('No MONGODB_URI provided. Using embedded persistent document store for zero-config local development.');
  }
  return false;
}

function getModel(name, schema) {
  // Return embedded persistent collection with identical async API
  return getCollection(name.toLowerCase());
}

module.exports = {
  connectDB,
  getModel,
  isMongooseConnected: () => isMongooseConnected
};
