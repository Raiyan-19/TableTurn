const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Restaurant } = require('./models/Restaurant');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

dotenv.config();

const viewDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tableturn';
  
  console.log('\n======================================================');
  console.log('   TABLETURN BANGLADESH — DATABASE VIEWER');
  console.log('======================================================\n');
  console.log(`Connecting to: ${mongoUri} ...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log('Connected to MongoDB successfully!\n');

    // 1. RESTAURANTS COLLECTION
    const restaurants = await Restaurant.find().select('name division subDistrict cuisineTypes priceCategory rating reviewsCount averageCostForTwo');
    console.log(`------------------------------------------------------`);
    console.log(` RESTAURANTS COLLECTION (${restaurants.length} Total Venues across 8 Divisions)`);
    console.log(`------------------------------------------------------`);
    console.table(
      restaurants.map((r, i) => ({
        '#': i + 1,
        Name: r.name,
        Division: r.division,
        Area: r.subDistrict,
        Cuisines: r.cuisineTypes.join(', '),
        Price: r.priceCategory,
        'Avg 2': `৳${r.averageCostForTwo}`,
        Rating: `⭐ ${r.rating} (${r.reviewsCount})`,
      }))
    );

    // 2. RESERVATIONS COLLECTION
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    console.log(`\n------------------------------------------------------`);
    console.log(` RESERVATIONS COLLECTION (${reservations.length} Active Bookings)`);
    console.log(`------------------------------------------------------`);
    if (reservations.length > 0) {
      console.table(
        reservations.map((res, i) => ({
          '#': i + 1,
          Code: res.reservationCode,
          Restaurant: res.restaurantName,
          Division: res.division,
          Date: res.date,
          Time: res.timeSlot,
          Guests: `${res.partySize} guests`,
          Section: res.seatingArea,
          Guest: `${res.guestName} (${res.guestPhone})`,
          Status: res.status.toUpperCase(),
        }))
      );
    } else {
      console.log('No reservations recorded yet.');
    }

    // 3. USERS COLLECTION
    const users = await User.find().select('name email phone role');
    console.log(`\n------------------------------------------------------`);
    console.log(` USERS COLLECTION (${users.length} Users)`);
    console.log(`------------------------------------------------------`);
    if (users.length > 0) {
      console.table(
        users.map((u, i) => ({
          '#': i + 1,
          Name: u.name,
          Email: u.email,
          Phone: u.phone,
          Role: u.role,
        }))
      );
    } else {
      console.log('Users stored in auth memory cache / register flow.');
    }

    console.log('\n======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\nDatabase Viewer Error:', error.message);
    process.exit(1);
  }
};

viewDatabase();
