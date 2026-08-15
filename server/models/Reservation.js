const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantAddress: {
      type: String,
    },
    division: {
      type: String,
      required: true,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Please provide guest email'],
      lowercase: true,
      trim: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Please provide guest contact phone (+880)'],
      match: [
        /^(?:\+8801|01)[3-9]\d{8}$/,
        'Please provide a valid Bangladeshi mobile number (e.g. +88017XXXXXXXX or 017XXXXXXXX)',
      ],
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: [true, 'Reservation date is required'],
      index: true,
    },
    timeSlot: {
      type: String, // e.g. "07:30 PM"
      required: [true, 'Time slot is required'],
      index: true,
    },
    seatingArea: {
      type: String,
      default: 'Main Dining',
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      min: [1, 'Party size must be at least 1'],
      max: [30, 'Party size cannot exceed 30 guests online'],
    },
    occasion: {
      type: String,
      enum: ['Casual Dining', 'Birthday Celebration', 'Anniversary', 'Business Meeting', 'Romantic Date', 'Family Gathering', 'Other'],
      default: 'Casual Dining',
    },
    specialNotes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true,
    },
    qrCodeData: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for slot conflicts & quick lookup
reservationSchema.index({ restaurant: 1, date: 1, timeSlot: 1, status: 1 });
reservationSchema.index({ guestPhone: 1, date: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
