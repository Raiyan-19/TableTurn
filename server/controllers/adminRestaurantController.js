const { Restaurant, BANGLADESH_DIVISIONS } = require('../models/Restaurant');
const { getDBStatus } = require('../config/db');
const { memoryRestaurants } = require('./restaurantController');

// @desc    Admin create new restaurant
// @route   POST /api/admin/restaurants
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      tagline,
      division,
      subDistrict,
      address,
      cuisineTypes,
      priceCategory,
      averageCostForTwo,
      photos,
      features,
      operationalHours,
      seatingAreas,
      defaultSlots,
      signatureDishes,
      dressCode,
      parkingInfo,
      chefNote,
      isFeatured,
      offer,
    } = req.body;

    if (!name || !division || !subDistrict || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, division, sub-district, and full address.',
      });
    }

    if (!BANGLADESH_DIVISIONS.includes(division)) {
      return res.status(400).json({
        success: false,
        message: `Invalid division. Must be one of: ${BANGLADESH_DIVISIONS.join(', ')}`,
      });
    }

    const defaultPhoto =
      photos && photos.length > 0 && photos[0].trim()
        ? photos
        : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'];

    const cuisines = Array.isArray(cuisineTypes)
      ? cuisineTypes
      : typeof cuisineTypes === 'string'
      ? cuisineTypes.split(',').map((c) => c.trim()).filter(Boolean)
      : ['Bengali Fine Dining', 'Continental'];

    const slots =
      Array.isArray(defaultSlots) && defaultSlots.length > 0
        ? defaultSlots
        : [
            { time: '12:30 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
            { time: '01:30 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
            { time: '07:00 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
            { time: '08:00 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
            { time: '09:00 PM', type: 'Main Dining', available: true, maxPartySize: 8 },
          ];

    const restaurantData = {
      name: name.trim(),
      tagline: tagline ? tagline.trim() : 'Curated dining experience in Bangladesh',
      division,
      subDistrict: subDistrict.trim(),
      address: address.trim(),
      cuisineTypes: cuisines,
      priceCategory: priceCategory || '৳৳',
      averageCostForTwo: Number(averageCostForTwo) || 1500,
      photos: defaultPhoto,
      rating: 4.8,
      reviewsCount: 1,
      features: Array.isArray(features) ? features : ['Halal Certified', 'Air Conditioned', 'WiFi'],
      operationalHours: operationalHours || { opening: '12:00 PM', closing: '11:00 PM', days: 'Everyday' },
      seatingAreas:
        Array.isArray(seatingAreas) && seatingAreas.length > 0
          ? seatingAreas
          : [
              { name: 'Main Dining', description: 'Standard table seating', capacity: 6 },
              { name: 'Rooftop / Terrace', description: 'Open-air views', capacity: 4 },
            ],
      defaultSlots: slots,
      signatureDishes: Array.isArray(signatureDishes) ? signatureDishes : [],
      dressCode: dressCode || 'Smart Casual',
      parkingInfo: parkingInfo || 'Valet Parking Available',
      chefNote: chefNote || 'Crafted with premium local and international ingredients.',
      isFeatured: !!isFeatured,
      offer: offer || { hasOffer: false, discountPercent: 0, tag: '' },
    };

    if (getDBStatus()) {
      const restaurant = await Restaurant.create(restaurantData);
      return res.status(201).json({
        success: true,
        message: `Restaurant '${restaurant.name}' successfully listed!`,
        data: restaurant,
      });
    } else {
      const memoryItem = {
        _id: `mem_res_${Date.now()}`,
        id: `mem_res_${Date.now()}`,
        ...restaurantData,
        createdAt: new Date().toISOString(),
      };
      memoryRestaurants.unshift(memoryItem);
      return res.status(201).json({
        success: true,
        message: `Restaurant '${memoryItem.name}' successfully listed!`,
        data: memoryItem,
      });
    }
  } catch (error) {
    console.error('createRestaurant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update existing restaurant
// @route   PUT /api/admin/restaurants/:id
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({
        success: true,
        message: 'Restaurant updated successfully',
        data: restaurant,
      });
    } else {
      const index = memoryRestaurants.findIndex((r) => r._id === id || r.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      memoryRestaurants[index] = { ...memoryRestaurants[index], ...req.body };
      return res.json({
        success: true,
        message: 'Restaurant updated successfully',
        data: memoryRestaurants[index],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete restaurant
// @route   DELETE /api/admin/restaurants/:id
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const restaurant = await Restaurant.findByIdAndDelete(id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({
        success: true,
        message: `Restaurant '${restaurant.name}' deleted successfully`,
      });
    } else {
      const index = memoryRestaurants.findIndex((r) => r._id === id || r.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      const deleted = memoryRestaurants.splice(index, 1);
      return res.json({
        success: true,
        message: `Restaurant '${deleted[0]?.name}' deleted successfully`,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Last-Minute Flash Offer on Restaurant
// @route   PATCH /api/admin/restaurants/:id/offer
const toggleRestaurantOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { hasOffer, discountPercent, tag, expiryTime } = req.body;

    const offerData = {
      hasOffer: Boolean(hasOffer),
      discountPercent: Number(discountPercent) || 0,
      tag: tag || (hasOffer ? `${discountPercent}% OFF Last-Minute Deal` : ''),
      expiryTime: expiryTime || '11:00 PM',
    };

    if (getDBStatus()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      restaurant.offer = offerData;
      await restaurant.save();
      return res.json({
        success: true,
        message: `Offer updated for ${restaurant.name}`,
        data: restaurant,
      });
    } else {
      const restaurant = memoryRestaurants.find((r) => r._id === id || r.id === id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      restaurant.offer = offerData;
      return res.json({
        success: true,
        message: `Offer updated for ${restaurant.name}`,
        data: restaurant,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantOffer,
};
