const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  getDivisionStats,
  getRestaurantSlots,
} = require('../controllers/restaurantController');

router.get('/meta/division-stats', getDivisionStats);
router.get('/:id/slots', getRestaurantSlots);
router.get('/:id', getRestaurantById);
router.get('/', getRestaurants);

module.exports = router;
