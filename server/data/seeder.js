const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Restaurant } = require('../models/Restaurant');
const User = require('../models/User');
const seedRestaurants = require('./seedRestaurants');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tableturn';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] MongoDB connected for seeding...');

    await Restaurant.deleteMany({});
    console.log('[Seeder] Existing restaurants cleared');

    const inserted = await Restaurant.insertMany(seedRestaurants);
    console.log(`[Seeder] Successfully seeded ${inserted.length} Bangladeshi restaurants across 8 divisions!`);

    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Failed to seed database:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
