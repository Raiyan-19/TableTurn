const { Restaurant } = require('../models/Restaurant');
const { getDBStatus } = require('../config/db');
const { memoryRestaurants } = require('./restaurantController');

// @desc    Add a review & star rating for a restaurant
// @route   POST /api/restaurants/:id/reviews
const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please write a review comment',
      });
    }

    const reviewObj = {
      user: req.user.id,
      userName: req.user.name || 'Verified Diner',
      rating: numRating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      if (!Array.isArray(restaurant.reviews)) {
        restaurant.reviews = [];
      }

      restaurant.reviews.unshift(reviewObj);

      // Recalculate average rating
      const totalStars = restaurant.reviews.reduce((acc, item) => acc + item.rating, 0);
      restaurant.reviewsCount = restaurant.reviews.length;
      restaurant.rating = Number((totalStars / restaurant.reviewsCount).toFixed(1));

      await restaurant.save();

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your review and rating have been posted.',
        data: {
          reviews: restaurant.reviews,
          rating: restaurant.rating,
          reviewsCount: restaurant.reviewsCount,
        },
      });
    } else {
      const restaurant = memoryRestaurants.find((r) => r._id === id || r.id === id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      if (!Array.isArray(restaurant.reviews)) {
        restaurant.reviews = [];
      }

      restaurant.reviews.unshift({
        _id: `rev_${Date.now()}`,
        ...reviewObj,
      });

      const totalStars = restaurant.reviews.reduce((acc, item) => acc + item.rating, 0);
      restaurant.reviewsCount = restaurant.reviews.length;
      restaurant.rating = Number((totalStars / restaurant.reviewsCount).toFixed(1));

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your review and rating have been posted.',
        data: {
          reviews: restaurant.reviews,
          rating: restaurant.rating,
          reviewsCount: restaurant.reviewsCount,
        },
      });
    }
  } catch (error) {
    console.error('addReview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a restaurant
// @route   GET /api/restaurants/:id/reviews
const getRestaurantReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const restaurant = await Restaurant.findById(id).select('reviews rating reviewsCount');
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({
        success: true,
        data: restaurant.reviews || [],
        rating: restaurant.rating,
        reviewsCount: restaurant.reviewsCount,
      });
    } else {
      const restaurant = memoryRestaurants.find((r) => r._id === id || r.id === id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({
        success: true,
        data: restaurant.reviews || [],
        rating: restaurant.rating,
        reviewsCount: restaurant.reviewsCount,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getRestaurantReviews,
};
