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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-surface-300 border-l border-white/10 h-full p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl z-10"
          >
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">My Dining Center</h3>
                    <p className="text-[11px] text-slate-400">Bookings, QR passes & saved venues</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingsDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex items-center gap-2 p-1 rounded-xl bg-surface-200 border border-white/5">
                <button
                  onClick={() => setDrawerTab('bookings')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    drawerTab === 'bookings'
                      ? 'bg-gold-500 text-slate-950 shadow-glow-gold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservations ({myBookings.length})</span>
                </button>

                <button
                  onClick={() => setDrawerTab('favorites')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    drawerTab === 'favorites'
                      ? 'bg-gold-500 text-slate-950 shadow-glow-gold'
                      : 'text-slate-400 hover:text-white'
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
                              ? 'bg-surface-200 border-gold-500/30'
                              : 'bg-white/5 border-white/5 opacity-70'
                          }`}
                        >
                          {/* Reference Code & Status */}
                          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                            <span className="font-mono text-xs font-extrabold text-gold-400">
                              {booking.reservationCode}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                isConfirmed
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-crimson-500/20 text-crimson-400'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          {/* Restaurant Title */}
                          <div className="mt-2.5">
                            <h4 className="text-sm font-bold text-white">
                              {booking.restaurantName}
                            </h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gold-400" />
                              {booking.division} Division
                            </p>
                          </div>

                          {/* Details Grid */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-gold-400" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-gold-400" />
                              <span>{booking.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Users className="w-3.5 h-3.5 text-gold-400" />
                              <span>{booking.partySize} Guests</span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              Area: {booking.seatingArea}
                            </div>
                          </div>

                          {/* Actions */}
                          {isConfirmed && (
                            <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                              <button
                                onClick={() => setActiveQrModal(booking)}
                                className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs font-bold flex items-center gap-1 border border-gold-500/30"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                View QR Pass
                              </button>

                              <button
                                onClick={() => handleCancelBooking(booking._id || booking.reservationCode)}
                                className="text-xs text-crimson-400 hover:text-crimson-300 font-semibold flex items-center gap-1 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-surface-200/50 border border-white/5">
                      <CalendarCheck className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-300">No active reservations yet</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Select a time slot on any dining card to reserve your table.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: FAVORITES ================= */}
              {drawerTab === 'favorites' && (
                <div>
                  {favoriteRestaurants.length > 0 ? (
                    favoriteRestaurants.map((restaurant) => (
                      <div
                        key={restaurant._id || restaurant.id}
                        className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex items-center gap-3 mb-3 group hover:border-gold-500/30 transition-all"
                      >
                        <img
                          src={restaurant.photos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gold-400">{restaurant.division}</span>
                            <span className="text-[10px] font-bold text-white flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-gold-400 text-gold-400" /> {restaurant.rating || 4.8}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{restaurant.name}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{restaurant.subDistrict}</p>
                          
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsBookingsDrawerOpen(false);
                                openBookingModal(restaurant);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-[10px] shadow-sm"
                            >
                              Book Table
                            </button>
                            <button
                              onClick={() => toggleFavorite(restaurant._id || restaurant.id)}
                              className="text-[10px] text-slate-400 hover:text-crimson-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-surface-200/50 border border-white/5">
                      <Heart className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-300">No favorite venues saved</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Click the ❤️ icon on any restaurant card to save it for quick booking.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Close */}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setIsBookingsDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-xs font-bold text-slate-200"
              >
                Close Center
              </button>
            </div>
          </motion.div>

          {/* Dedicated QR Code Popover Modal */}
          {activeQrModal && (
            <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
              <div 
                onClick={() => setActiveQrModal(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md" 
              />
              <div className="relative bg-surface-300 rounded-3xl p-6 border border-gold-500/40 text-center max-w-sm w-full shadow-2xl z-10">
                <button
                  onClick={() => setActiveQrModal(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="text-sm font-bold text-white mb-1">Host Stand Digital Pass</h4>
                <p className="text-[11px] text-slate-400 mb-4">{activeQrModal.restaurantName}</p>

                <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-2xl my-2 border-2 border-gold-500">
                  <QRCodeSVG
                    value={JSON.stringify({
                      code: activeQrModal.reservationCode,
                      venue: activeQrModal.restaurantName,
                      date: activeQrModal.date,
                      slot: activeQrModal.timeSlot,
                      guests: activeQrModal.partySize,
                    })}
                    size={180}
                  />
                  <p className="text-[10px] font-mono font-bold text-slate-900 mt-2">
                    {activeQrModal.reservationCode}
                  </p>
                </div>

                <div className="mt-4 text-xs text-slate-300">
                  <span>{activeQrModal.date} at {activeQrModal.timeSlot} • {activeQrModal.partySize} Guests</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </AnimatePresence>
  );
};
