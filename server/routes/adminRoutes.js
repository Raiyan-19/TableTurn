const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  getAdminStats,
  updateReservationStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here strictly require authentication and 'manager' or 'admin' role
router.use(protect);
router.use(authorize('manager', 'admin'));

router.get('/reservations', getAllReservations);
router.get('/stats', getAdminStats);
router.patch('/reservations/:id/status', updateReservationStatus);

module.exports = router;
