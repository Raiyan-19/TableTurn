const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  getAdminStats,
  updateReservationStatus,
} = require('../controllers/adminController');
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantOffer,
} = require('../controllers/adminRestaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here strictly require authentication and 'manager' or 'admin' role
router.use(protect);
router.use(authorize('manager', 'admin'));

// Reservations & Analytics
router.get('/reservations', getAllReservations);
router.get('/stats', getAdminStats);
router.patch('/reservations/:id/status', updateReservationStatus);

// Restaurant Management (Full CRUD & Flash Deals)
router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.patch('/restaurants/:id/offer', toggleRestaurantOffer);

module.exports = router;

