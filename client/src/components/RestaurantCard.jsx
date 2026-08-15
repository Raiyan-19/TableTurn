import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Utensils,
  Eye,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';

export const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();
  const { openBookingModal, openDetailModal, selectedDate, partySize } = useReservation();

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const restaurantId = restaurant._id || restaurant.id;
  const isFav = favorites.includes(restaurantId);

  const photos = restaurant.photos && restaurant.photos.length > 0
    ? restaurant.photos
    : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'];

  const slots = restaurant.defaultSlots || [
    { time: '12:30 PM', type: 'Main Dining', available: true },
    { time: '01:15 PM', type: 'Main Dining', available: true },
    { time: '07:00 PM', type: 'Main Dining', available: true },
    { time: '07:45 PM', type: 'Terrace', available: true },
    { time: '08:30 PM', type: 'Chef’s Table', available: true },
  ];

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-card-elevated hover:border-gold-500/40 transition-all flex flex-col group"
    >
      {/* Photo Carousel Container */}
      <div 
        onClick={() => openDetailModal(restaurant)}
        className="relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={photos[currentPhotoIndex]}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Division & Sub-district Badge or Flash Offer Banner */}
        {restaurant.offer?.hasOffer ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 via-crimson-600 to-rose-600 text-white text-[10px] font-extrabold tracking-wider shadow-lg animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{restaurant.offer.discountPercent}% OFF • {restaurant.offer.tag || 'Flash Deal'}</span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/15 text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
            <MapPin className="w-3 h-3 text-gold-400" />
            <span>{restaurant.subDistrict}, {restaurant.division}</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(restaurantId);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-all ${
            isFav ? 'bg-crimson-500 text-white shadow-glow-gold' : 'text-slate-300 hover:text-white hover:bg-white/20'
          }`}
          title="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white stroke-white' : ''}`} />
        </button>


        {/* Carousel Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentPhotoIndex ? 'bg-gold-400 w-3' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Pill on Hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-bold text-slate-200 border border-white/10">
            <Eye className="w-3 h-3 text-gold-400" /> View Details
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating, Price Tier, and Cuisine Tags */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold">
                <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                {restaurant.rating || 4.8}
              </span>
              <span className="text-xs font-bold text-slate-400">
                ({restaurant.reviewsCount || 150}+)
              </span>
              <span className="text-xs font-extrabold text-gold-400 tracking-wider">
                {restaurant.priceCategory || '৳৳'}
              </span>
            </div>

            {/* Average Cost for Two */}
            <span className="text-[11px] text-slate-400 font-medium">
              ~৳{restaurant.averageCostForTwo || 1500} for 2
            </span>
          </div>

          {/* Restaurant Title */}
          <h3 
            onClick={() => openDetailModal(restaurant)}
            className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors cursor-pointer line-clamp-1"
          >
            {restaurant.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {restaurant.tagline || 'Curated dining experience'}
          </p>

          {/* Cuisines & Features Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {restaurant.cuisineTypes && restaurant.cuisineTypes.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300"
              >
                {cuisine}
              </span>
            ))}
            {restaurant.features && restaurant.features.slice(0, 2).map((feat) => (
              <span
                key={feat}
                className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Resy-Style Clickable Available Time Slots */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Available Slots ({selectedDate})
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {slots.slice(0, 6).map((slot, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  openBookingModal(restaurant, slot);
                }}
                className="group/slot relative px-2.5 py-2 rounded-xl bg-surface-100 hover:bg-gold-500 hover:text-slate-950 border border-white/10 hover:border-gold-400 text-slate-200 transition-all text-center flex flex-col items-center justify-center shadow-sm hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-xs font-bold tracking-tight group-hover/slot:text-slate-950">
                  {slot.time}
                </span>
                <span className="text-[9px] text-slate-400 group-hover/slot:text-slate-900 truncate max-w-[80px]">
                  {slot.type || 'Dining'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
