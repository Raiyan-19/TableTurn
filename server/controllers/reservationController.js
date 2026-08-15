const QRCode = require('qrcode');
const Reservation = require('../models/Reservation');
const { Restaurant } = require('../models/Restaurant');
const { memoryRestaurants } = require('./restaurantController');
const { getDBStatus } = require('../config/db');

// In-memory reservations store
let memoryReservations = [];

// Helper to generate custom human-friendly Bangladesh reservation code (e.g. TT-DHK-4892)
const generateReservationCode = (division = 'DHK') => {
  const divCode = division ? division.substring(0, 3).toUpperCase() : 'BD';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TT-${divCode}-${randomNum}`;
};

// Helper to generate QR code data URI
const generateQRCodeURI = async (payload) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(payload), {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      width: 280,
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return `TABLETURN_RESERVATION:${payload.code}`;
  }
};

// @desc    Create a new table reservation
// @route   POST /api/reservations
const createReservation = async (req, res) => {
  try {
    const {
      restaurantId,
      date,
      timeSlot,
      partySize,
      seatingArea = 'Main Dining',
      occasion = 'Casual Dining',
      specialNotes = '',
      guestName,
      guestEmail,
      guestPhone,
    } = req.body;

    if (!restaurantId || !date || !timeSlot || !partySize || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required reservation fields (date, slot, party size, guest info)',
      });
    }

    // BD Phone validation regex (+8801XXXXXXXXX or 01XXXXXXXXX)
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(guestPhone.replace(/\s+/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Bangladeshi phone number. Format must be +8801XXXXXXXXX or 01XXXXXXXXX (e.g. 01712345678)',
      });
    }

    // Find restaurant details
    let restaurant;
    if (getDBStatus()) {
      restaurant = await Restaurant.findById(restaurantId);
    } else {
      restaurant = memoryRestaurants.find(
        (r) =>
          r._id === restaurantId ||
          r.id === restaurantId ||
          (restaurantId && r.name.toLowerCase() === restaurantId.toLowerCase())
      );
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const reservationCode = generateReservationCode(restaurant.division);

    const qrPayload = {
      code: reservationCode,
      restaurant: restaurant.name,
      division: restaurant.division,
      date,
      timeSlot,
      seating: seatingArea,
      guests: partySize,
      guestName,
      guestPhone,
    };

    const qrCodeData = await generateQRCodeURI(qrPayload);

    const reservationData = {
      reservationCode,
      restaurant: restaurant._id || restaurantId,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      division: restaurant.division,
      date,
      timeSlot,
      partySize: parseInt(partySize, 10),
      seatingArea,
      occasion,
      specialNotes,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      guestPhone,
      status: 'confirmed',
      qrCodeData,
      user: req.user ? req.user.id : null,
      createdAt: new Date().toISOString(),
    };

    if (getDBStatus()) {
      const reservation = await Reservation.create(reservationData);
      return res.status(201).json({
        success: true,
        message: 'Table reservation successfully confirmed!',
        data: reservation,
      });
    } else {
      const reservation = {
        _id: 'resv_' + Date.now(),
        ...reservationData,
      };
      memoryReservations.unshift(reservation);

      return res.status(201).json({
        success: true,
        message: 'Table reservation successfully confirmed!',
        data: reservation,
      });
    }
  } catch (error) {
    console.error('createReservation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's reservations (Requires Authentication)
// @route   GET /api/reservations/my
const getMyReservations = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userId = user.id;
    const userEmail = typeof user.email === 'string' ? user.email.toLowerCase() : null;
    const userPhone = typeof user.phone === 'string' ? user.phone : null;
    const isElevated = user.role === 'admin' || user.role === 'manager';

    if (getDBStatus()) {
      let query;
      if (isElevated) {
        // Elevated staff can optionally filter or view all
        query = {};
        if (typeof req.query.email === 'string' && req.query.email.trim()) {
          query.guestEmail = req.query.email.trim().toLowerCase();
        }
        if (typeof req.query.phone === 'string' && req.query.phone.trim()) {
          query.guestPhone = req.query.phone.trim();
        }
      } else {
        // Standard user can ONLY see reservations matching their user ID, email, or phone
        const conditions = [];
        if (userId) conditions.push({ user: userId });
        if (userEmail) conditions.push({ guestEmail: userEmail });
        if (userPhone) conditions.push({ guestPhone: userPhone });

        if (conditions.length === 0) {
          return res.json({ success: true, count: 0, data: [] });
        }
        query = { $or: conditions };
      }

      const reservations = await Reservation.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: reservations.length, data: reservations });
    } else {
      let results = [...memoryReservations];
      if (!isElevated) {
        results = results.filter(
          (r) =>
            (userId && r.user === userId) ||
            (userEmail && r.guestEmail && r.guestEmail.toLowerCase() === userEmail) ||
            (userPhone && r.guestPhone === userPhone)
        );
      }
      return res.json({ success: true, count: results.length, data: results });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lookup reservation by unique reference code
// @route   GET /api/reservations/lookup/:code
const lookupReservation = async (req, res) => {
  try {
    const { code } = req.params;

    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid reservation code parameter' });
    }

    const cleanCode = code.trim().toUpperCase();

    if (getDBStatus()) {
      const reservation = await Reservation.findOne({
        reservationCode: cleanCode,
      });
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      return res.json({ success: true, data: reservation });
    } else {
      const reservation = memoryReservations.find(
        (r) => r.reservationCode && r.reservationCode.toUpperCase() === cleanCode
      );
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }
      return res.json({ success: true, data: reservation });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a reservation (Requires Auth & Ownership Check)
// @route   PATCH /api/reservations/:id/cancel
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid reservation identifier' });
    }

    const targetId = id.trim();

    if (getDBStatus()) {
      const reservation = await Reservation.findById(targetId);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      // Ownership & authorization verification (BOLA/IDOR prevention)
      const isOwner =
        (reservation.user && reservation.user.toString() === user.id) ||
        (user.email && reservation.guestEmail && reservation.guestEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && reservation.guestPhone === user.phone);

      const isStaff = user.role === 'admin' || user.role === 'manager';

      if (!isOwner && !isStaff) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to cancel this reservation.',
        });
      }

      reservation.status = 'cancelled';
      await reservation.save();
      return res.json({ success: true, message: 'Reservation cancelled successfully', data: reservation });
    } else {
      const reservation = memoryReservations.find((r) => r._id === targetId || r.reservationCode === targetId);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      const isOwner =
        (reservation.user && reservation.user === user.id) ||
        (user.email && reservation.guestEmail && reservation.guestEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && reservation.guestPhone === user.phone);

      const isStaff = user.role === 'admin' || user.role === 'manager';

      if (!isOwner && !isStaff) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to cancel this reservation.',
        });
      }

      reservation.status = 'cancelled';
      return res.json({ success: true, message: 'Reservation cancelled successfully', data: reservation });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  lookupReservation,
  cancelReservation,
  memoryReservations,
};
