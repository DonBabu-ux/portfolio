require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Project = require('./models/Project');

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in .env');
    return process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('database is empty! Seeding from JSON...');
      const data = JSON.parse(fs.readFileSync('./data/projects.json', 'utf-8'));
      
      // Remove any _id or internal fields if present, just insert clean data
      await Project.insertMany(data);
      console.log(`✅ Successfully seeded ${data.length} projects into MongoDB!`);
    } else {
      console.log(`✅ Database already contains ${count} projects. No seeding needed.`);
    }

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedDatabase();
