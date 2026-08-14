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
  CalendarPlus, 
  MessageSquareText,
  AlertCircle
} from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { api } from '../services/api';

export const MyBookingsDrawer = () => {
  const {
    isBookingsDrawerOpen,
    setIsBookingsDrawerOpen,
    myBookings,
    fetchMyBookings,
    loadingBookings,
    showToast,
  } = useReservation();

  const [activeQrModal, setActiveQrModal] = useState(null);

  useEffect(() => {
    if (isBookingsDrawerOpen) {
      fetchMyBookings();
    }
  }, [isBookingsDrawerOpen]);

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-surface-300 border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">My Table Reservations</h3>
                    <p className="text-[11px] text-slate-400">Manage real-time bookings & QR passes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBookingsDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bookings List */}
              <div className="mt-5 space-y-4">
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
                        className={`p-4 rounded-2xl border transition-all ${
                          isConfirmed
                            ? 'bg-surface-200 border-gold-500/30'
                            : 'bg-white/5 border-white/5 opacity-70'
                        }`}
                      >
                        {/* Top Reference Bar */}
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

                        {/* Venue Title & Division */}
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
                            Section: {booking.seatingArea}
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
                      Pick any dining slot across 8 divisions to reserve instantly.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Close */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setIsBookingsDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-surface-100 hover:bg-surface-50 text-xs font-bold text-slate-200"
              >
                Close Drawer
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
