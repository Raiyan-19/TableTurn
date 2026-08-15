import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  CalendarCheck,
  MessageSquarePlus,
  User,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { api } from '../services/api';

export const RestaurantDetailModal = () => {
  const { user, isAuthenticated, openAuthModal, favorites, toggleFavorite } = useAuth();
  const {
    isDetailModalOpen,
    closeDetailModal,
    detailRestaurant,
    openBookingModal,
    selectedDate,
    partySize,
    showToast,
  } = useReservation();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'about' | 'reviews' | 'gallery'
  const [reviewsList, setReviewsList] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentRating, setCurrentRating] = useState(4.8);
  const [currentReviewsCount, setCurrentReviewsCount] = useState(120);

  useEffect(() => {
    if (isDetailModalOpen && detailRestaurant) {
      setCurrentRating(detailRestaurant.rating || 4.8);
      setCurrentReviewsCount(detailRestaurant.reviewsCount || 120);
      setReviewsList(detailRestaurant.reviews || [
        {
          userName: 'Tanvir Ahmed',
          rating: 5,
          comment: 'Exceptional ambiance, world-class hospitality, and the artisanal kebabs were heavenly.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          userName: 'Nabila Karim',
          rating: 5,
          comment: 'One of the finest fine dining spots in Bangladesh. Reserving through TableTurn was instant!',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ]);
    }
  }, [isDetailModalOpen, detailRestaurant]);

  if (!isDetailModalOpen || !detailRestaurant) return null;

  const restaurantId = detailRestaurant._id || detailRestaurant.id;
  const isFav = favorites.includes(restaurantId);
  const photos = detailRestaurant.photos || [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to write a customer review', 'error');
      openAuthModal('login');
      return;
    }

    if (!userComment.trim()) {
      showToast('Please enter your review feedback', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.addReview(restaurantId, {
        rating: userRating,
        comment: userComment.trim(),
      });

      if (res.success) {
        showToast('Your review and rating have been posted!');
        setReviewsList((prev) => [
          {
            userName: user.name || 'Verified Diner',
            rating: userRating,
            comment: userComment.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        if (res.data) {
          setCurrentRating(res.data.rating);
          setCurrentReviewsCount(res.data.reviewsCount);
        }
        setUserComment('');
      }
    } catch (err) {
      showToast(err.message || 'Review submission failed', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

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

        {/* Modal Container Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-white/15 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col text-slate-900 dark:text-white transition-colors duration-200"
        >
          {/* Top Hero Banner with Image */}
          <div className="relative h-64 sm:h-80 w-full shrink-0">
            <img
              src={photos[0]}
              alt={detailRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0B0F19] via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white border border-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => toggleFavorite(restaurantId)}
              className={`absolute top-4 right-16 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 border border-white/20 flex items-center justify-center transition-colors ${
                isFav ? 'bg-crimson-500 text-white' : 'text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>

            {/* Flash Offer Badge on Banner */}
            {detailRestaurant.offer?.hasOffer && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-600 via-crimson-600 to-rose-600 text-white text-xs font-extrabold shadow-glow-gold animate-pulse">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{detailRestaurant.offer.discountPercent}% OFF Flash Deal Active</span>
              </div>
            )}

            {/* Floating Title & Meta on Banner Bottom */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                    {detailRestaurant.division} Division
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white font-semibold text-[10px] border border-white/20">
                    {detailRestaurant.subDistrict}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-gold-400">
                    ⭐ {currentRating} ({currentReviewsCount} Reviews)
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    • ~৳{detailRestaurant.averageCostForTwo || 1500} for 2
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                  {detailRestaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
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
          <div className="px-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-white/5 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'menu'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Signature Menu & Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'reviews'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span>Reviews & Ratings ({reviewsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
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
              className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'gallery'
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Gallery ({photos.length})</span>
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

            {/* TAB 2: REVIEWS & RATINGS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Write Review Box */}
                <div className="p-4 rounded-2xl bg-surface-200 border border-gold-500/30 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <MessageSquarePlus className="w-4 h-4" /> Share Your Dining Experience & Rating
                  </h4>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 font-bold">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 text-gold-400 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= userRating ? 'fill-gold-400 text-gold-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-gold-400 font-mono">({userRating} / 5 Stars)</span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Write your honest dining review (food quality, service, ambiance)..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-surface-100 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleReviewSubmit}
                      disabled={submittingReview}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all"
                    >
                      {submittingReview ? 'Posting Review...' : 'Post Customer Review'}
                    </button>
                  </div>
                </div>

                {/* List of Verified Reviews */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Verified Customer Reviews ({reviewsList.length})
                  </h4>

                  {reviewsList.map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-surface-200 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs">
                            {rev.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent Diner'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-gold-400 text-gold-400' : 'text-slate-600'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ABOUT */}
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

            {/* TAB 4: GALLERY */}
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
