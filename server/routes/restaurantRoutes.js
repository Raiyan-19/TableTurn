const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  getDivisionStats,
  getRestaurantSlots,
} = require('../controllers/restaurantController');
const {
  addReview,
  getRestaurantReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/meta/division-stats', getDivisionStats);
router.get('/:id/slots', getRestaurantSlots);
router.get('/:id/reviews', getRestaurantReviews);
router.post('/:id/reviews', protect, addReview);
router.get('/:id', getRestaurantById);
router.get('/', getRestaurants);

module.exports = router;

