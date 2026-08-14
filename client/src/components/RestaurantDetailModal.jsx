import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Car, 
  Sparkles, 
  Utensils, 
  Shirt, 
  Phone, 
  Share2,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';

export const RestaurantDetailModal = () => {
  const { favorites, toggleFavorite } = useAuth();
  const {
    isDetailModalOpen,
    closeDetailModal,
    detailRestaurant,
    openBookingModal,
    selectedDate,
    partySize,
  } = useReservation();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'about' | 'gallery'

  if (!isDetailModalOpen || !detailRestaurant) return null;

  const isFav = favorites.includes(detailRestaurant._id);
  const photos = detailRestaurant.photos || [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetailModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-surface-300 rounded-3xl border border-white/15 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Top Hero Banner with Image */}
          <div className="relative h-64 sm:h-80 w-full shrink-0">
            <img
              src={photos[0]}
              alt={detailRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-300 via-surface-300/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => toggleFavorite(detailRestaurant._id)}
              className={`absolute top-4 right-16 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-colors ${
                isFav ? 'bg-crimson-500 text-white' : 'text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>

            {/* Floating Title & Meta on Banner Bottom */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                    {detailRestaurant.division} Division
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-semibold text-[10px]">
                    {detailRestaurant.subDistrict}
                  </span>
                  <span className="text-xs font-bold text-gold-400">
                    {detailRestaurant.priceCategory || '৳৳'} (~৳{detailRestaurant.averageCostForTwo || 1500} for 2)
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {detailRestaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {detailRestaurant.tagline}
                </p>
              </div>

              {/* Instant Book Table Trigger Button */}
              <button
                onClick={() => {
                  closeDetailModal();
                  openBookingModal(detailRestaurant);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold flex items-center gap-2 shrink-0 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-white/10 flex items-center gap-6 bg-surface-200">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Signature Menu & Pricing (৳ BDT)</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>About & Ambiance</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Photo Gallery ({photos.length})</span>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* TAB 1: MENU */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">
                    Chef’s Curated Highlights
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Prices include all Bangladesh VAT & Service
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(detailRestaurant.signatureDishes || [
                    { name: 'House Signature Charcoal Platter', priceBDT: 1850, description: 'Grilled prime cuts with artisanal mint jus and charred flatbread', isChefSpecial: true },
                    { name: 'Slow Dum Shahi Biryani', priceBDT: 590, description: 'Fragrant chinigura rice infused with saffron and braised mutton', isChefSpecial: true },
                    { name: 'Saffron Borhani & Firni Pot', priceBDT: 240, description: 'Traditional dessert crafted with condensed milk and crushed pistachios', isChefSpecial: false }
                  ]).map((dish, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-surface-200 border border-white/5 flex items-start gap-3 justify-between group hover:border-gold-500/30 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                            {dish.name}
                          </h4>
                          {dish.isChefSpecial && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                              Chef's Pick
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-gold-400 shrink-0">
                        ৳{dish.priceBDT}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Available Slots Pill Selector */}
                <div className="mt-6 p-4 rounded-2xl bg-surface-100 border border-gold-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gold-400" />
                      Instant Slots for {selectedDate} ({partySize} Guests)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {(detailRestaurant.defaultSlots || []).map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          closeDetailModal();
                          openBookingModal(detailRestaurant, slot);
                        }}
                        className="py-2 px-1 rounded-xl bg-surface-200 hover:bg-gold-500 hover:text-slate-950 border border-white/10 text-xs font-bold text-slate-200 text-center transition-all shadow-sm"
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                {/* Chef Note */}
                <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/20">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Culinary Note
                  </span>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed italic">
                    "{detailRestaurant.chefNote || 'Our culinary philosophy blends authentic Bangladeshi spices with world-class dining hospitality.'}"
                  </p>
                </div>

                {/* Meta Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-surface-200 border border-white/5">
                    <MapPin className="w-4 h-4 text-gold-400 mb-1" />
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Address</span>
                    <span className="text-xs font-medium text-white">{detailRestaurant.address}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-200 border border-white/5">
                    <Clock className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Hours</span>
                    <span className="text-xs font-medium text-white">
                      {detailRestaurant.operationalHours?.opening || '12:00 PM'} - {detailRestaurant.operationalHours?.closing || '11:00 PM'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-200 border border-white/5">
                    <Car className="w-4 h-4 text-sky-400 mb-1" />
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Parking</span>
                    <span className="text-xs font-medium text-white">{detailRestaurant.parkingInfo || 'Valet on site'}</span>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Venue Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(detailRestaurant.features || []).map((feat) => (
                      <span
                        key={feat}
                        className="px-3 py-1 rounded-xl bg-surface-200 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="h-52 rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={photo}
                      alt={`${detailRestaurant.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
