import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  CalendarCheck, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Trash2, 
  QrCode, 
  Heart,
  Star,
  Utensils
} from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const MyBookingsDrawer = () => {
  const {
    isBookingsDrawerOpen,
    setIsBookingsDrawerOpen,
    myBookings,
    fetchMyBookings,
    loadingBookings,
    openBookingModal,
    openDetailModal,
    showToast,
  } = useReservation();

  const { favorites, toggleFavorite } = useAuth();
  const [drawerTab, setDrawerTab] = useState('bookings'); // 'bookings' | 'favorites'
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [activeQrModal, setActiveQrModal] = useState(null);

  useEffect(() => {
    if (isBookingsDrawerOpen) {
      fetchMyBookings();
      loadFavoriteRestaurants();
    }
  }, [isBookingsDrawerOpen]);

  const loadFavoriteRestaurants = async () => {
    try {
      const res = await api.getRestaurants();
      if (res.success && Array.isArray(res.data)) {
        setAllRestaurants(res.data);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this table reservation?')) {
      return;
    }
    try {
      const res = await api.cancelReservation(bookingId);
      if (res.success) {
        showToast('Reservation cancelled successfully');
        fetchMyBookings();
      }
    } catch (e) {
      showToast(e.message || 'Failed to cancel', 'error');
    }
  };

  const favoriteRestaurants = allRestaurants.filter((r) =>
    favorites.includes(r._id) || favorites.includes(r.id)
  );

  return (
    <AnimatePresence>
      {isBookingsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBookingsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0B0F19] border-l border-slate-200 dark:border-white/10 h-full p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl z-10 transition-colors duration-200"
          >
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center text-amber-600 dark:text-gold-400">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">My Dining Center</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Bookings, QR passes & saved venues</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingsDrawerOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setDrawerTab('bookings')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    drawerTab === 'bookings'
                      ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservations ({myBookings.length})</span>
                </button>

                <button
                  onClick={() => setDrawerTab('favorites')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    drawerTab === 'favorites'
                      ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Saved Favorites ({favorites.length})</span>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-1">
              
              {/* ================= TAB 1: BOOKINGS ================= */}
              {drawerTab === 'bookings' && (
                <div>
                  {loadingBookings ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Loading your reservations...
                    </div>
                  ) : myBookings.length > 0 ? (
                    myBookings.map((booking) => {
                      const isConfirmed = booking.status === 'confirmed';

                      return (
                        <div
                          key={booking._id || booking.reservationCode}
                          className={`p-4 rounded-2xl border transition-all mb-3 ${
                            isConfirmed
                              ? 'bg-slate-50 border-amber-300/80 dark:bg-white/5 dark:border-gold-500/30'
                              : 'bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/5 opacity-70'
                          }`}
                        >
                          {/* Reference Code & Status */}
                          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-white/5">
                            <span className="font-mono text-xs font-extrabold text-amber-700 dark:text-gold-400">
                              {booking.reservationCode}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                isConfirmed
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-crimson-500/15 text-crimson-700 dark:text-crimson-400'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          {/* Restaurant Title */}
                          <div className="mt-2.5">
                            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
                              {booking.restaurantName}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-500 dark:text-gold-400" />
                              {booking.division} Division
                            </p>
                          </div>

                          {/* Details Grid */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                              <span>{booking.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                              <Users className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                              <span>{booking.partySize} Guests</span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Area: {booking.seatingArea}
                            </div>
                          </div>

                          {/* Actions */}
                          {isConfirmed && (
                            <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
                              <button
                                onClick={() => setActiveQrModal(booking)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-gold-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Show QR Pass</span>
                              </button>

                              <button
                                onClick={() => handleCancelBooking(booking._id || booking.reservationCode)}
                                className="px-2.5 py-1.5 rounded-lg text-crimson-600 dark:text-crimson-400 hover:bg-crimson-500/10 text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-950 dark:text-white">No Active Reservations</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Explore restaurants across Bangladesh and book your table instantly.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: FAVORITES ================= */}
              {drawerTab === 'favorites' && (
                <div>
                  {favoriteRestaurants.length > 0 ? (
                    favoriteRestaurants.map((res) => (
                      <div
                        key={res._id || res.id}
                        onClick={() => {
                          setIsBookingsDrawerOpen(false);
                          openDetailModal(res);
                        }}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-gold-500/40 cursor-pointer transition-all flex items-center gap-3 mb-2.5"
                      >
                        <img
                          src={res.photos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'}
                          alt={res.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-950 dark:text-white truncate">{res.name}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-600 dark:text-gold-400" />
                            {res.subDistrict}, {res.division}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-gold-400">
                              <Star className="w-3 h-3 fill-current" />
                              {res.rating || 4.8}
                            </span>
                            <span className="text-[10px] text-slate-400">• {res.priceCategory}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(res._id || res.id);
                          }}
                          className="p-2 text-crimson-500 hover:bg-crimson-500/10 rounded-lg"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <Heart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-950 dark:text-white">No Saved Favorites</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Click the heart icon on any restaurant card to save your top dining venues.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* QR Pass Full Modal Preview */}
            <AnimatePresence>
              {activeQrModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-between z-20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-gold-400">Host Stand QR Pass</span>
                    <button
                      onClick={() => setActiveQrModal(null)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-auto flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white">{activeQrModal.restaurantName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeQrModal.date} • {activeQrModal.timeSlot} • {activeQrModal.partySize} Guests
                    </p>

                    <div className="my-4 p-3 bg-white rounded-2xl shadow-xl border border-slate-200">
                      <QRCodeSVG
                        value={JSON.stringify({
                          code: activeQrModal.reservationCode,
                          restaurant: activeQrModal.restaurantName,
                          guests: activeQrModal.partySize,
                          date: activeQrModal.date,
                          time: activeQrModal.timeSlot,
                        })}
                        size={170}
                        level="H"
                      />
                    </div>

                    <span className="font-mono text-sm font-black text-amber-700 dark:text-gold-400 tracking-wider">
                      {activeQrModal.reservationCode}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Show this pass to the restaurant host on arrival</p>
                  </div>

                  <button
                    onClick={() => setActiveQrModal(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 font-bold text-xs"
                  >
                    Close Pass
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
