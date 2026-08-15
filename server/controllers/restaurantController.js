const { Restaurant, BANGLADESH_DIVISIONS } = require('../models/Restaurant');
const Reservation = require('../models/Reservation');
const seedRestaurants = require('../data/seedRestaurants');
const { getDBStatus } = require('../config/db');

// In-memory restaurants store seeded with all 8 administrative divisions
let memoryRestaurants = seedRestaurants.map((item, index) => ({
  _id: `res_bd_${index + 1}`,
  id: `res_bd_${index + 1}`,
  ...item,
}));

// Helper to safely escape regular expression special characters (ReDoS protection)
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all restaurants with rich filtering and search
// @route   GET /api/restaurants
const getRestaurants = async (req, res) => {
  try {
    const isDB = getDBStatus();
    const {
      division,
      subDistrict,
      cuisine,
      price,
      search,
      feature,
      minRating,
      sort = 'recommended',
    } = req.query;

    const safeDivision = typeof division === 'string' ? division.trim() : '';
    const safeSubDistrict = typeof subDistrict === 'string' ? subDistrict.trim() : '';
    const safeCuisine = typeof cuisine === 'string' ? cuisine.trim() : '';
    const safePrice = typeof price === 'string' ? price.trim() : '';
    const safeFeature = typeof feature === 'string' ? feature.trim() : '';
    const safeSearch = typeof search === 'string' ? search.trim() : '';

    if (getDBStatus()) {
      let query = {};

      if (safeDivision && safeDivision !== 'All') {
        query.division = new RegExp(`^${escapeRegex(safeDivision)}$`, 'i');
      }

      if (safeSubDistrict && safeSubDistrict !== 'All' && safeSubDistrict !== 'All Areas') {
        query.subDistrict = new RegExp(escapeRegex(safeSubDistrict), 'i');
      }

      if (safeCuisine && safeCuisine !== 'All' && safeCuisine !== 'All Cuisines') {
        query.cuisineTypes = { $in: [new RegExp(escapeRegex(safeCuisine), 'i')] };
      }

      if (safePrice && safePrice !== 'All') {
        query.priceCategory = safePrice;
      }

      if (safeFeature && safeFeature !== 'All') {
        query.features = { $in: [new RegExp(escapeRegex(safeFeature), 'i')] };
      }

      if (minRating && !isNaN(parseFloat(minRating))) {
        query.rating = { $gte: parseFloat(minRating) };
      }

      if (safeSearch !== '') {
        const searchRegex = new RegExp(escapeRegex(safeSearch), 'i');
        query.$or = [
          { name: searchRegex },
          { subDistrict: searchRegex },
          { address: searchRegex },
          { cuisineTypes: searchRegex },
          { tagline: searchRegex },
        ];
      }

      let sortOptions = {};
      if (sort === 'rating') sortOptions = { rating: -1, reviewsCount: -1 };
      else if (sort === 'price_asc') sortOptions = { averageCostForTwo: 1 };
      else if (sort === 'price_desc') sortOptions = { averageCostForTwo: -1 };
      else if (sort === 'popular') sortOptions = { reviewsCount: -1 };
      else sortOptions = { isFeatured: -1, rating: -1 };

      const restaurants = await Restaurant.find(query).sort(sortOptions);
      return res.json({
        success: true,
        count: restaurants.length,
        data: restaurants,
      });
    } else {
      // High-performance Memory filtering
      let results = [...memoryRestaurants];

      if (division && division !== 'All') {
        results = results.filter(
          (r) => r.division.toLowerCase() === division.toLowerCase()
        );
      }

      if (subDistrict && subDistrict !== 'All' && subDistrict !== 'All Areas') {
        results = results.filter((r) =>
          r.subDistrict.toLowerCase().includes(subDistrict.toLowerCase())
        );
      }

      if (cuisine && cuisine !== 'All' && cuisine !== 'All Cuisines') {
        results = results.filter((r) =>
          r.cuisineTypes.some((c) =>
            c.toLowerCase().includes(cuisine.toLowerCase())
          )
        );
      }

      if (price && price !== 'All') {
        results = results.filter((r) => r.priceCategory === price);
      }

      if (feature && feature !== 'All') {
        results = results.filter((r) =>
          r.features.some((f) => f.toLowerCase().includes(feature.toLowerCase()))
        );
      }

      if (minRating) {
        results = results.filter((r) => r.rating >= parseFloat(minRating));
      }

      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        results = results.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.subDistrict.toLowerCase().includes(s) ||
            r.address.toLowerCase().includes(s) ||
            r.tagline.toLowerCase().includes(s) ||
            r.cuisineTypes.some((c) => c.toLowerCase().includes(s)) ||
            (r.signatureDishes &&
              r.signatureDishes.some((d) => d.name.toLowerCase().includes(s)))
        );
      }

      // Sort
      if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
      } else if (sort === 'price_asc') {
        results.sort((a, b) => a.averageCostForTwo - b.averageCostForTwo);
      } else if (sort === 'price_desc') {
        results.sort((a, b) => b.averageCostForTwo - a.averageCostForTwo);
      } else if (sort === 'popular') {
        results.sort((a, b) => b.reviewsCount - a.reviewsCount);
      } else {
        // Recommended: Featured first, then highest rating
        results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
      }

      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }
  } catch (error) {
    console.error('getRestaurants error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single restaurant details
// @route   GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({ success: true, data: restaurant });
    } else {
      const restaurant = memoryRestaurants.find((r) => r._id === id || r.id === id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({ success: true, data: restaurant });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get divisional breakdown stats for the division quick switcher
// @route   GET /api/restaurants/meta/division-stats
const getDivisionStats = async (req, res) => {
  try {
    const allDivisions = BANGLADESH_DIVISIONS;
    const stats = {};

    allDivisions.forEach((d) => {
      stats[d] = 0;
    });

    if (getDBStatus()) {
      const counts = await Restaurant.aggregate([
        { $group: { _id: '$division', count: { $sum: 1 } } },
      ]);
      counts.forEach((item) => {
        if (stats[item._id] !== undefined) {
          stats[item._id] = item.count;
        }
      });
    } else {
      memoryRestaurants.forEach((r) => {
        if (stats[r.division] !== undefined) {
          stats[r.division]++;
        }
      });
    }

    return res.json({
      success: true,
      data: stats,
      totalCount: Object.values(stats).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dynamic live available slots for a specific restaurant & date
// @route   GET /api/restaurants/:id/slots
const getRestaurantSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, partySize = 2 } = req.query;

    const queryDate = date || new Date().toISOString().split('T')[0];
    let restaurant;

    if (getDBStatus()) {
      restaurant = await Restaurant.findById(id);
    } else {
      restaurant = memoryRestaurants.find((r) => r._id === id || r.id === id);
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const defaultSlots = restaurant.defaultSlots || [
      { time: '12:30 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
      { time: '01:15 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
      { time: '07:00 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
      { time: '07:45 PM', type: 'Rooftop / Terrace', available: true, maxPartySize: 6 },
      { time: '08:30 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
      { time: '09:15 PM', type: 'Chef’s Table', available: true, maxPartySize: 4 },
    ];

    // Return slots enriched with seating areas and availability
    const enrichedSlots = defaultSlots.map((slot, index) => {
      const isAvailable = parseInt(partySize, 10) <= (slot.maxPartySize || 8);
      return {
        id: `slot_${index + 1}`,
        time: slot.time,
        seatingType: slot.type || 'Main Dining',
        available: isAvailable,
        maxGuests: slot.maxPartySize || 8,
      };
    });

    return res.json({
      success: true,
      restaurantId: id,
      date: queryDate,
      partySize: parseInt(partySize, 10),
      slots: enrichedSlots,
      seatingAreas: restaurant.seatingAreas || [
        { name: 'Main Dining', description: 'Standard table seating', capacity: 6 },
        { name: 'Rooftop / Terrace', description: 'Open-air panoramic views', capacity: 4 },
        { name: 'Chef’s Table', description: 'Front-row culinary view', capacity: 2 },
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getDivisionStats,
  getRestaurantSlots,
  memoryRestaurants,
};
