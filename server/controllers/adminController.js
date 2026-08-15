const Reservation = require('../models/Reservation');
const { Restaurant, BANGLADESH_DIVISIONS } = require('../models/Restaurant');
const { getDBStatus } = require('../config/db');
const { memoryReservations } = require('./reservationController');
const { memoryRestaurants } = require('./restaurantController');

// @desc    Get all platform reservations across all restaurants & divisions (Admin/Manager only)
// @route   GET /api/admin/reservations
const getAllReservations = async (req, res) => {
  try {
    const { status, division, restaurantId, search, date } = req.query;

    if (getDBStatus()) {
      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }
      if (division && division !== 'All') {
        query.division = new RegExp(`^${division}$`, 'i');
      }
      if (restaurantId && restaurantId !== 'all') {
        query.restaurant = restaurantId;
      }
      if (date) {
        query.date = date;
      }
      if (search && typeof search === 'string' && search.trim()) {
        const s = search.trim();
        query.$or = [
          { reservationCode: new RegExp(s, 'i') },
          { guestName: new RegExp(s, 'i') },
          { guestPhone: new RegExp(s, 'i') },
          { guestEmail: new RegExp(s, 'i') },
          { restaurantName: new RegExp(s, 'i') },
        ];
      }

      const reservations = await Reservation.find(query).sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: reservations.length,
        data: reservations,
      });
    } else {
      let results = [...memoryReservations];

      if (status && status !== 'all') {
        results = results.filter((r) => r.status === status);
      }
      if (division && division !== 'All') {
        results = results.filter((r) => r.division.toLowerCase() === division.toLowerCase());
      }
      if (restaurantId && restaurantId !== 'all') {
        results = results.filter((r) => r.restaurant === restaurantId);
      }
      if (date) {
        results = results.filter((r) => r.date === date);
      }
      if (search && typeof search === 'string' && search.trim()) {
        const s = search.trim().toLowerCase();
        results = results.filter(
          (r) =>
            (r.reservationCode && r.reservationCode.toLowerCase().includes(s)) ||
            (r.guestName && r.guestName.toLowerCase().includes(s)) ||
            (r.guestPhone && r.guestPhone.includes(s)) ||
            (r.guestEmail && r.guestEmail.toLowerCase().includes(s)) ||
            (r.restaurantName && r.restaurantName.toLowerCase().includes(s))
        );
      }

      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }
  } catch (error) {
    console.error('getAllReservations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get high-level platform analytics & KPI statistics
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    let totalBookings = 0;
    let confirmedCount = 0;
    let seatedCount = 0;
    let cancelledCount = 0;
    let totalRestaurants = 0;
    const divisionBreakdown = {};

    BANGLADESH_DIVISIONS.forEach((d) => {
      divisionBreakdown[d] = 0;
    });

    if (getDBStatus()) {
      totalBookings = await Reservation.countDocuments();
      confirmedCount = await Reservation.countDocuments({ status: 'confirmed' });
      seatedCount = await Reservation.countDocuments({ status: 'seated' });
      cancelledCount = await Reservation.countDocuments({ status: 'cancelled' });
      totalRestaurants = await Restaurant.countDocuments();

      const divStats = await Reservation.aggregate([
        { $group: { _id: '$division', count: { $sum: 1 } } },
      ]);
      divStats.forEach((item) => {
        if (item._id && divisionBreakdown[item._id] !== undefined) {
          divisionBreakdown[item._id] = item.count;
        }
      });
    } else {
      totalBookings = memoryReservations.length;
      confirmedCount = memoryReservations.filter((r) => r.status === 'confirmed').length;
      seatedCount = memoryReservations.filter((r) => r.status === 'seated').length;
      cancelledCount = memoryReservations.filter((r) => r.status === 'cancelled').length;
      totalRestaurants = memoryRestaurants.length;

      memoryReservations.forEach((r) => {
        if (r.division && divisionBreakdown[r.division] !== undefined) {
          divisionBreakdown[r.division]++;
        }
      });
    }

    return res.json({
      success: true,
      data: {
        totalBookings,
        confirmedCount,
        seatedCount,
        cancelledCount,
        totalRestaurants,
        divisionBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update reservation status (confirm, seat, cancel, complete)
// @route   PATCH /api/admin/reservations/:id/status
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'seated', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    if (getDBStatus()) {
      const isObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
      const query = isObjectId ? { _id: id } : { reservationCode: id.toUpperCase() };
      const reservation = await Reservation.findOne(query);

      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      reservation.status = status;
      await reservation.save();
      return res.json({
        success: true,
        message: `Reservation status updated to '${status}'`,
        data: reservation,
      });
    } else {
      const reservation = memoryReservations.find(
        (r) => r._id === id || r.reservationCode.toUpperCase() === id.toUpperCase()
      );
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      reservation.status = status;
      return res.json({
        success: true,
        message: `Reservation status updated to '${status}'`,
        data: reservation,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllReservations,
  getAdminStats,
  updateReservationStatus,
};
