require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User.model.js'); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;

async function clearUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const result = await User.deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} users`);

    process.exit(0);
  } catch (error) {
    console.error('Error clearing users:', error.message);
    process.exit(1);
  }
}

clearUsers();