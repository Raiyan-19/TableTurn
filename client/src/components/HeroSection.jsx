import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Flame, 
  Compass,
  ArrowDown
} from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { HERO_EXPERIENCES } from '../data/mockData';

export const HeroSection = () => {
  const {
    selectedDivision,
    setSelectedDivision,
    setSelectedSubZone,
    selectedCuisine,
    setSelectedCuisine,
    selectedDate,
    setSelectedDate,
    partySize,
    setPartySize,
  } = useReservation();

  // Cycling animated headline state
  const [currentExpIndex, setCurrentExpIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExpIndex((prev) => (prev + 1) % HERO_EXPERIENCES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeExp = HERO_EXPERIENCES[currentExpIndex];

  return (
    <section className="relative pt-8 pb-10 md:pt-14 md:pb-16 overflow-hidden mesh-gradient-bg">
      
      {/* Dynamic Background Ambient Glowing Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline & Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Animated Curated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-glow-gold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Bangladesh Dining Guide & Real-Time Booking</span>
          </motion.div>

          {/* Animated Cycling Experience Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center">
            <span>The Premier Table Reservation in</span>
            <div className="h-14 sm:h-16 relative w-full overflow-hidden flex items-center justify-center mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeExp.division}
                  initial={{ y: 35, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -35, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute bg-gradient-to-r from-gold-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent"
                >
                  {activeExp.division} & Beyond
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>

          {/* Dynamic Cycling Tagline */}
          <div className="h-8 relative overflow-hidden flex items-center justify-center mt-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeExp.text}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-sm sm:text-base text-slate-300 font-medium tracking-wide flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{activeExp.text}</span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Resy-Style Interactive Booking Engine Bar */}
        <div className="mt-8 max-w-5xl mx-auto p-3 sm:p-4 rounded-3xl glass-panel-gold border border-gold-500/30 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            
            {/* 1. Division Selector */}
            <div className="p-2.5 rounded-2xl bg-surface-200/90 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block">
                  Region
                </span>
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedSubZone('All');
                  }}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900 text-white">All 8 BD Divisions</option>
                  <option value="Dhaka" className="bg-slate-900 text-white">Dhaka Division</option>
                  <option value="Chattogram" className="bg-slate-900 text-white">Chattogram Division</option>
                  <option value="Sylhet" className="bg-slate-900 text-white">Sylhet Division</option>
                  <option value="Rajshahi" className="bg-slate-900 text-white">Rajshahi Division</option>
                  <option value="Khulna" className="bg-slate-900 text-white">Khulna Division</option>
                  <option value="Barishal" className="bg-slate-900 text-white">Barishal Division</option>
                  <option value="Rangpur" className="bg-slate-900 text-white">Rangpur Division</option>
                  <option value="Mymensingh" className="bg-slate-900 text-white">Mymensingh Division</option>
                </select>
              </div>
            </div>

            {/* 2. Date Picker */}
            <div className="p-2.5 rounded-2xl bg-surface-200/90 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block">
                  Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Guests Party Size */}
            <div className="p-2.5 rounded-2xl bg-surface-200/90 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block">
                  Guests
                </span>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-slate-900 text-white">1 Guest (Solo Table)</option>
                  <option value={2} className="bg-slate-900 text-white">2 Guests (Table for Two)</option>
                  <option value={3} className="bg-slate-900 text-white">3 Guests</option>
                  <option value={4} className="bg-slate-900 text-white">4 Guests (Family / Friends)</option>
                  <option value={5} className="bg-slate-900 text-white">5 Guests</option>
                  <option value={6} className="bg-slate-900 text-white">6 Guests (Large Table)</option>
                  <option value={8} className="bg-slate-900 text-white">8+ Guests (VIP / Party)</option>
                </select>
              </div>
            </div>

            {/* 4. Action Button */}
            <button
              onClick={() => {
                const gridElement = document.getElementById('restaurant-grid-section');
                if (gridElement) {
                  gridElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Available Tables</span>
              <ArrowDown className="w-4 h-4 text-slate-950 animate-bounce" />
            </button>

          </div>
        </div>

        {/* Floating Featured Ambient Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          {/* Card 1: Trending Dish */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5 shadow-card-elevated group cursor-pointer"
            onClick={() => {
              setSelectedDivision('Dhaka');
              setSelectedCuisine('Pan-Asian');
              const grid = document.getElementById('restaurant-grid-section');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80"
                alt="Wagyu Robata"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 bg-black/70 text-[9px] font-bold text-gold-400 px-1 py-0.5 rounded">
                ৳2,400
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-gold-400 text-gold-400" /> Trending in Gulshan
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                Wagyu Robata Skewers
              </h4>
              <p className="text-[11px] text-slate-400 truncate">The Grove Gulshan 2</p>
            </div>
          </motion.div>

          {/* Card 2: Authentic Regional Heritage */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5 shadow-card-elevated group cursor-pointer"
            onClick={() => {
              setSelectedDivision('Chattogram');
              setSelectedCuisine('Mezban');
              const grid = document.getElementById('restaurant-grid-section');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80"
                alt="Mezban Gosht"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 bg-black/70 text-[9px] font-bold text-emerald-400 px-1 py-0.5 rounded">
                ৳480
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" /> Mezban Classic
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Royal Mezban Gosht
              </h4>
              <p className="text-[11px] text-slate-400 truncate">Mezban Haat, Chattogram</p>
            </div>
          </motion.div>

          {/* Card 3: Scenic Riverfront */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5 shadow-card-elevated group cursor-pointer"
            onClick={() => {
              setSelectedDivision('Rajshahi');
              setSelectedCuisine('Seafood');
              const grid = document.getElementById('restaurant-grid-section');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80"
                alt="Padma Ilish"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 bg-black/70 text-[9px] font-bold text-gold-400 px-1 py-0.5 rounded">
                ৳750
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-400" /> Sunset Dining
              </span>
              <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                Padma Shorshe Ilish
              </h4>
              <p className="text-[11px] text-slate-400 truncate">Padma Breeze, Rajshahi</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
