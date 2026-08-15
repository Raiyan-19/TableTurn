const mongoose = require('mongoose');

const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      default: 'Curated dining experience in Bangladesh',
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      enum: BANGLADESH_DIVISIONS,
      index: true,
    },
    subDistrict: {
      type: String,
      required: [true, 'Sub-district / Neighborhood is required (e.g., Gulshan, GEC, Zindabazar)'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide full address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
    cuisineTypes: {
      type: [String],
      required: true,
      index: true,
    },
    priceCategory: {
      type: String,
      enum: ['৳', '৳৳', '৳৳৳', '৳৳৳৳'],
      default: '৳৳',
      index: true,
    },
    averageCostForTwo: {
      type: Number, // e.g. 1200 BDT
      default: 1500,
    },
    photos: {
      type: [String],
      required: true,
      default: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
      index: true,
    },
    reviewsCount: {
      type: Number,
      default: 120,
    },
    operationalHours: {
      opening: { type: String, default: '12:00 PM' },
      closing: { type: String, default: '11:00 PM' },
      days: { type: String, default: 'Everyday' },
    },
    features: {
      type: [String],
      default: ['Halal Certified', 'Air Conditioned', 'WiFi'],
    },
    seatingAreas: [
      {
        name: { type: String, default: 'Main Dining' },
        description: { type: String, default: 'Standard table seating' },
        capacity: { type: Number, default: 4 },
        premiumSurcharge: { type: Number, default: 0 },
      },
    ],
    defaultSlots: [
      {
        time: { type: String, required: true },
        type: { type: String, default: 'Main Dining' },
        available: { type: Boolean, default: true },
        maxPartySize: { type: Number, default: 8 },
      },
    ],
    signatureDishes: [
      {
        name: { type: String, required: true },
        priceBDT: { type: Number, required: true },
        description: { type: String },
        photo: { type: String },
        isChefSpecial: { type: Boolean, default: false },
      },
    ],
    dressCode: {
      type: String,
      default: 'Smart Casual',
    },
    parkingInfo: {
      type: String,
      default: 'Valet Parking Available',
    },
    chefNote: {
      type: String,
      default: 'Experience our artisanal recipes crafted with locally sourced Bangladeshi spices and global techniques.',
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    offer: {
      hasOffer: { type: Boolean, default: false },
      discountPercent: { type: Number, default: 0 },
      tag: { type: String, default: '' },
      expiryTime: { type: String, default: '11:00 PM' },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String, default: 'Verified Diner' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Compound indexing for high performance multi-attribute discovery
restaurantSchema.index({ division: 1, cuisineTypes: 1, priceCategory: 1 });
restaurantSchema.index({ name: 'text', subDistrict: 'text', cuisineTypes: 'text', address: 'text' });

module.exports = {
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  BANGLADESH_DIVISIONS,
};
