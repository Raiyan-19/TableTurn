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

      // Auto-seed default Admin & Manager accounts if missing
      const User = require('./models/User');
      const adminUser = await User.findOne({ email: 'admin@tableturn.bd' }).select('+password');
      if (!adminUser) {
        await User.create({
          name: 'System Admin Bangladesh',
          email: 'admin@tableturn.bd',
          phone: '01912345678',
          password: 'admin1122',
          role: 'admin',
        });
        console.log('[Database] Auto-seeded System Admin: admin@tableturn.bd');
      } else {
        // Ensure admin has role 'admin'
        if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          await adminUser.save();
        }
      }

      const mgrUser = await User.findOne({ email: 'manager@thegrove.bd' });
      if (!mgrUser) {
        await User.create({
          name: 'Shakila Jahan (Gulshan Grove Manager)',
          email: 'manager@thegrove.bd',
          phone: '01819887766',
          password: 'Shakila1122',
          role: 'manager',
        });
        console.log('[Database] Auto-seeded Venue Manager: manager@thegrove.bd');
      }
    } catch (e) {
      console.warn('[Database] Auto-seeding check skipped:', e.message);
    }
  }
});


const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configure CORS safely (VAPT-10)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy blocked this cross-origin request.'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' })); // Limit body payload size
app.use(morgan('dev'));

// Global API rate limiting
app.use('/api', apiLimiter);

// Specific Auth rate limiting (VAPT-08)
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


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
