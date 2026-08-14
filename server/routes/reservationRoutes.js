const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  lookupReservation,
  cancelReservation,
} = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/my', getMyReservations);
router.get('/lookup/:code', lookupReservation);
router.patch('/:id/cancel', cancelReservation);

module.exports = router;
