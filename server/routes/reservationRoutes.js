const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  lookupReservation,
  cancelReservation,
  checkinReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/lookup/:code', lookupReservation);
router.patch('/:id/cancel', protect, cancelReservation);
router.patch('/:id/checkin', protect, checkinReservation);

module.exports = router;


