import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useReservation } from '../context/ReservationContext';

export const HostPortalModal = ({ isOpen, onClose }) => {
  const { showToast } = useReservation();
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setLookupResult(null);

    try {
      // Secure lookup directly via dedicated lookup endpoint
      const cleanCode = searchCode.trim().toUpperCase();
      const res = await api.lookupReservation(cleanCode);
      if (res.success && res.data) {
        setLookupResult(res.data);
      } else {
        setErrorMsg(`No active reservation found with code "${cleanCode}".`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lookup failed. Please verify the reservation reference code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatGuest = async () => {
    if (lookupResult) {
      try {
        await api.checkinReservation(lookupResult._id || lookupResult.reservationCode);
        setLookupResult({ ...lookupResult, status: 'seated' });
        showToast(`Guest ${lookupResult.guestName} marked as Seated!`);
      } catch (err) {
        showToast(err.message || 'Check-in failed', 'error');
      }
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-surface-300 rounded-3xl border border-gold-500/40 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-glow-gold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400">
                  Host Stand & Manager Terminal
                </span>
                <h3 className="text-xl font-bold text-white">
                  TableTurn Host Partner Portal
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Lookup Form */}
          <form onSubmit={handleLookup} className="mt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Verify Guest Reservation Code or QR Ticket
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Ref Code (e.g. TT-DHK-4892)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all shrink-0"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>

          {/* Error Display */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Lookup Result Card */}
          {lookupResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-5 rounded-2xl bg-surface-200 border border-gold-500/30 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Reservation Reference</span>
                  <p className="font-mono text-sm font-extrabold text-gold-400">{lookupResult.reservationCode}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  lookupResult.status === 'seated'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : lookupResult.status === 'confirmed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/10 text-slate-400'
                }`}>
                  {lookupResult.status}
                </span>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Primary Guest</span>
                  <span className="font-bold text-white">{lookupResult.guestName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Contact Phone</span>
                  <span className="font-mono font-bold text-slate-200">{lookupResult.guestPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Allocated Slot</span>
                  <span className="font-bold text-gold-300">{lookupResult.date} at {lookupResult.timeSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Party Size</span>
                  <span className="font-bold text-white">{lookupResult.partySize} Guests • {lookupResult.seatingArea}</span>
                </div>
              </div>

              {/* Special Notes / Occasion */}
              {(lookupResult.occasion || lookupResult.specialNotes) && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                  {lookupResult.occasion && (
                    <p className="text-gold-400 font-semibold mb-1">
                      Occasion: {lookupResult.occasion}
                    </p>
                  )}
                  {lookupResult.specialNotes && (
                    <p className="text-slate-300 italic">
                      Notes: "{lookupResult.specialNotes}"
                    </p>
                  )}
                </div>
              )}

              {/* Host Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={handleSeatGuest}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-glow-emerald flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Seat Table & Check In</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick Host Tips */}
          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bangladesh Host Stand Engine v2.4</span>
            <span className="text-gold-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 8 Divisions Active
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
