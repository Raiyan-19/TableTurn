import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  Share2, 
  Download, 
  CalendarPlus, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  MessageSquareText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { api } from '../services/api';

const OCCASIONS = [
  'Casual Dining',
  'Birthday Celebration',
  'Anniversary',
  'Romantic Date',
  'Business Meeting',
  'Family Gathering',
];

export const ReservationModal = () => {
  const { user } = useAuth();
  const {
    isBookingModalOpen,
    closeBookingModal,
    bookingRestaurant,
    selectedSlot,
    setSelectedSlot,
    selectedDate,
    setSelectedDate,
    partySize,
    setPartySize,
    showToast,
    fetchMyBookings,
  } = useReservation();

  // Booking Flow Steps: 1 -> 2 -> 3 -> 4 (Confirmed)
  const [step, setStep] = useState(1);
  const [seatingArea, setSeatingArea] = useState('Main Dining');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [specialNotes, setSpecialNotes] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('+8801');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setGuestName(user.name || '');
      setGuestEmail(user.email || '');
      setGuestPhone(user.phone || '+8801');
    }
  }, [user]);

  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setConfirmedBooking(null);
      if (selectedSlot && selectedSlot.type) {
        setSeatingArea(selectedSlot.type);
      }
    }
  }, [isBookingModalOpen, selectedSlot]);

  if (!isBookingModalOpen || !bookingRestaurant) return null;

  const seatingOptions = bookingRestaurant.seatingAreas || [
    { name: 'Main Dining', description: 'Standard table seating', capacity: 6 },
    { name: 'Rooftop / Terrace', description: 'Open-air panoramic views', capacity: 4 },
    { name: 'Chef’s Table', description: 'Front-row culinary view', capacity: 2 },
  ];

  // Validate Bangladesh Mobile Number (+8801XXXXXXXXX or 01XXXXXXXXX)
  const validatePhone = (num) => {
    const cleaned = num.replace(/\s+/g, '');
    const regex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!regex.test(cleaned)) {
      setPhoneError('Please enter a valid BD phone number (e.g. +8801712345678 or 01712345678)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleNextToStep2 = () => {
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setStep(3);
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();

    if (!validatePhone(guestPhone)) {
      return;
    }

    if (!guestName.trim() || !guestEmail.trim()) {
      showToast('Please fill in your name and email', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        restaurantId: bookingRestaurant._id,
        restaurantName: bookingRestaurant.name,
        division: bookingRestaurant.division,
        date: selectedDate,
        timeSlot: selectedSlot?.time || '07:30 PM',
        partySize: partySize,
        seatingArea: seatingArea,
        occasion: occasion,
        specialNotes: specialNotes,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
      };

      const res = await api.createReservation(payload);
      if (res.success) {
        setConfirmedBooking(res.data);
        setStep(4);
        fetchMyBookings();
        showToast(`Table confirmed at ${bookingRestaurant.name}! Code: ${res.data.reservationCode}`);

        // Fire festive confetti animation
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#EAB308'],
        });
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Reservation failed. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate and download ICS Calendar File
  const downloadCalendarEvent = () => {
    if (!confirmedBooking) return;
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TableTurn BD//Restaurant Reservation//EN
BEGIN:VEVENT
UID:${confirmedBooking.reservationCode}@tableturn.bd
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${confirmedBooking.date.replace(/-/g, '')}T190000Z
SUMMARY:TableTurn Reservation: ${bookingRestaurant.name}
DESCRIPTION:Table reservation for ${confirmedBooking.partySize} guests at ${bookingRestaurant.name}. Code: ${confirmedBooking.reservationCode}.
LOCATION:${bookingRestaurant.address}, ${bookingRestaurant.division}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TableTurn-${confirmedBooking.reservationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBookingModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-surface-300 rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Top Progress Indicator */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400">
                Resy-Powered Booking Engine
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{bookingRestaurant.name}</span>
                <span className="text-xs font-semibold text-slate-400">({bookingRestaurant.division})</span>
              </h2>
            </div>
            <button
              onClick={closeBookingModal}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="my-5 flex items-center justify-between">
            {['1. Slot & Guests', '2. Occasion & Notes', '3. BD Contact Info', '4. Confirmation'].map((label, idx) => {
              const currentStepNumber = idx + 1;
              const isDone = step > currentStepNumber || (step === 4 && currentStepNumber === 4);
              const isActive = step === currentStepNumber;

              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    {idx > 0 && (
                      <div className={`h-0.5 flex-1 transition-all ${step >= currentStepNumber ? 'bg-gold-500' : 'bg-white/10'}`} />
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone || isActive
                          ? 'bg-gold-500 text-slate-950 shadow-glow-gold'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {isDone && step !== currentStepNumber ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : currentStepNumber}
                    </div>
                    {idx < 3 && (
                      <div className={`h-0.5 flex-1 transition-all ${step > currentStepNumber ? 'bg-gold-500' : 'bg-white/10'}`} />
                    )}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-semibold text-center hidden sm:block ${isActive ? 'text-gold-300 font-bold' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ================= STEP 1: Slot & Seating Area ================= */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                
                {/* Interactive Date, Time & Guests Selector Bar */}
                <div className="p-3 rounded-2xl bg-surface-200 border border-gold-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-inner">
                  
                  {/* 1. Date Picker */}
                  <div className="p-2.5 rounded-xl bg-surface-100 border border-white/10 flex items-center gap-2.5 hover:border-gold-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-400 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[9px] font-extrabold text-gold-400 uppercase tracking-wider block">
                        Selected Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 2. Time Slot Dropdown */}
                  <div className="p-2.5 rounded-xl bg-surface-100 border border-white/10 flex items-center gap-2.5 hover:border-gold-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[9px] font-extrabold text-gold-400 uppercase tracking-wider block">
                        Reserved Time
                      </label>
                      <select
                        value={selectedSlot?.time || '07:30 PM'}
                        onChange={(e) => {
                          const found = (bookingRestaurant.defaultSlots || []).find((s) => s.time === e.target.value);
                          if (found) {
                            setSelectedSlot(found);
                            if (found.type) setSeatingArea(found.type);
                          } else {
                            setSelectedSlot({ time: e.target.value, type: seatingArea });
                          }
                        }}
                        className="w-full bg-transparent text-xs font-bold text-gold-300 focus:outline-none cursor-pointer"
                      >
                        {(bookingRestaurant.defaultSlots || [
                          { time: '12:30 PM' },
                          { time: '01:15 PM' },
                          { time: '07:00 PM' },
                          { time: '07:45 PM' },
                          { time: '08:30 PM' },
                          { time: '09:15 PM' },
                        ]).map((s, idx) => (
                          <option key={idx} value={s.time} className="bg-slate-900 text-white">
                            {s.time} {s.type ? `(${s.type})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Party Size Selector */}
                  <div className="p-2.5 rounded-xl bg-surface-100 border border-white/10 flex items-center gap-2.5 hover:border-gold-500/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-400 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[9px] font-extrabold text-gold-400 uppercase tracking-wider block">
                        Party Size
                      </label>
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                        className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((num) => (
                          <option key={num} value={num} className="bg-slate-900 text-white">
                            {num} {num === 1 ? 'Guest (Solo Table)' : num === 2 ? 'Guests (Table for 2)' : `${num} Guests`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>


                {/* Seating Area Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Choose Seating Section
                  </label>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {seatingOptions.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => setSeatingArea(opt.name)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          seatingArea === opt.name
                            ? 'bg-gold-500/20 border-gold-500/60 text-white shadow-glow-gold'
                            : 'bg-surface-200 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{opt.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{opt.description || 'Standard dining'}</p>
                        </div>
                        {seatingArea === opt.name && (
                          <span className="mt-2 text-[10px] font-bold text-gold-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Alternate Slots */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Switch Time Slot
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(bookingRestaurant.defaultSlots || []).map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedSlot(slot);
                          if (slot.type) setSeatingArea(slot.type);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedSlot?.time === slot.time
                            ? 'bg-gold-500 text-slate-950 font-extrabold shadow-glow-gold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 1 Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleNextToStep2}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold flex items-center gap-2"
                >
                  <span>Continue to Guest Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: Occasion & Special Requests ================= */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                
                {/* Occasion Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Dining Occasion (Optional)
                  </label>
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => setOccasion(occ)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                          occasion === occ
                            ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50 font-bold'
                            : 'bg-surface-200 border border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary & Special Requests */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center justify-between">
                    <span>Special Notes & Dietary Requirements</span>
                    <span className="text-[10px] text-slate-400 font-normal">Max 500 chars</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Window table preferred, nut allergy, celebration cake request, baby high-chair needed..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="mt-2 w-full p-3 rounded-2xl bg-surface-200 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition-all resize-none"
                  />
                </div>

              </div>

              {/* Step 2 Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNextToStep3}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold flex items-center gap-2"
                >
                  <span>Continue to Contact Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: BD Contact Verification ================= */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                
                {/* Guest Full Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Primary Guest Full Name *
                  </label>
                  <div className="mt-1.5 relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Email Address (For Confirmation & QR Ticket) *
                  </label>
                  <div className="mt-1.5 relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. tanvir@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 transition-all"
                    />
                  </div>
                </div>

                {/* Bangladesh Phone Number Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center justify-between">
                    <span>Bangladesh Mobile Number (+880) *</span>
                    <span className="text-[10px] text-emerald-400">SMS / WhatsApp pass enabled</span>
                  </label>
                  <div className="mt-1.5 relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+8801711223344 or 01711223344"
                      value={guestPhone}
                      onChange={(e) => {
                        setGuestPhone(e.target.value);
                        if (phoneError) validatePhone(e.target.value);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                        phoneError ? 'border-crimson-500' : 'border-white/10 focus:border-gold-500/60'
                      }`}
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-[11px] text-crimson-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {phoneError}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Accepts Bangladeshi prefixes (Grameenphone, Banglalink, Robi, Teletalk)
                    </p>
                  )}
                </div>

                {/* Step 3 Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Allocating Real-Time Slot...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Confirm Instant Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ================= STEP 4: Instant Confirmation & QR Pass ================= */}
          {step === 4 && confirmedBooking && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="p-6 rounded-3xl bg-gradient-to-b from-surface-100 to-surface-200 border border-gold-500/30 text-center">
                
                {/* Success Icon */}
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-glow-emerald">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-display text-2xl font-bold text-white">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your table at <strong className="text-gold-400">{bookingRestaurant.name}</strong> is locked.
                </p>

                {/* Unique Booking Code Badge */}
                <div className="my-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 border border-gold-500/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking Ref:</span>
                  <span className="font-mono text-sm font-extrabold text-gold-400 tracking-widest">
                    {confirmedBooking.reservationCode}
                  </span>
                </div>

                {/* Digital QR Code Pass */}
                <div className="p-4 rounded-2xl bg-white w-fit mx-auto shadow-2xl my-2 border-4 border-gold-500/30">
                  <QRCodeSVG
                    value={JSON.stringify({
                      code: confirmedBooking.reservationCode,
                      venue: bookingRestaurant.name,
                      date: confirmedBooking.date,
                      slot: confirmedBooking.timeSlot,
                      guests: confirmedBooking.partySize,
                      phone: confirmedBooking.guestPhone,
                    })}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                  <p className="text-[9px] font-bold text-slate-900 mt-2 uppercase tracking-wider">
                    Scan at Host Stand
                  </p>
                </div>

                {/* Reservation Summary Details */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left p-3 rounded-2xl bg-black/30 border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date</span>
                    <span className="font-bold text-white">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Time</span>
                    <span className="font-bold text-gold-300">{confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Guests</span>
                    <span className="font-bold text-white">{confirmedBooking.partySize} Persons</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Seating</span>
                    <span className="font-bold text-white truncate">{confirmedBooking.seatingArea}</span>
                  </div>
                </div>

                {/* SMS & Calendar Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={downloadCalendarEvent}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-colors border border-white/10"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-gold-400" />
                    Add to Calendar (.ics)
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `TableTurn Bangladesh: My table at ${bookingRestaurant.name} is confirmed for ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. Ref: ${confirmedBooking.reservationCode}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-glow-emerald"
                  >
                    <MessageSquareText className="w-3.5 h-3.5" />
                    Share via WhatsApp
                  </a>

                  <button
                    onClick={closeBookingModal}
                    className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-xs font-extrabold text-slate-950 transition-colors shadow-glow-gold"
                  >
                    Done & View Discoveries
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
