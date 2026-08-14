const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database (with automatic in-memory fallback & auto-seeding)
connectDB().then(async (connected) => {
  if (connected) {
    try {
      const { Restaurant } = require('./models/Restaurant');
      const count = await Restaurant.countDocuments();
      if (count === 0) {
        const seedRestaurants = require('./data/seedRestaurants');
        await Restaurant.insertMany(seedRestaurants);
        console.log(`[Database] Auto-seeded ${seedRestaurants.length} restaurants across 8 divisions!`);
      }
    } catch (e) {
      console.warn('[Database] Auto-seeding check skipped:', e.message);
    }
  }
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Health & Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'TableTurn Bangladesh API Engine',
    timestamp: new Date().toISOString(),
    supportedDivisions: [
      'Dhaka',
      'Chattogram',
      'Rajshahi',
      'Khulna',
      'Barishal',
      'Sylhet',
      'Rangpur',
      'Mymensingh',
    ],
  });
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TableTurn Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on http://127.0.0.1:${PORT}`);
});

module.exports = { app, server };
