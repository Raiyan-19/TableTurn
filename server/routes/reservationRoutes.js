const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  lookupReservation,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createReservation);
router.get('/my', protect, getMyReservations);
router.get('/lookup/:code', lookupReservation);
router.patch('/:id/cancel', protect, cancelReservation);

module.exports = router;

