import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Compass
} from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { BANGLADESH_DIVISIONS, DIVISION_SUBZONES } from '../data/mockData';
import { api } from '../services/api';

export const DivisionQuickSwitcher = () => {
  const { 
    selectedDivision, 
    setSelectedDivision, 
    selectedSubZone, 
    setSelectedSubZone 
  } = useReservation();

  const [divisionStats, setDivisionStats] = useState({
    Dhaka: 3,
    Chattogram: 2,
    Rajshahi: 2,
    Khulna: 2,
    Barishal: 2,
    Sylhet: 2,
    Rangpur: 2,
    Mymensingh: 2,
  });

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.getDivisionStats();
        if (res.success && res.data) {
          setDivisionStats(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadStats();
  }, []);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const currentSubZones = selectedDivision !== 'All' ? DIVISION_SUBZONES[selectedDivision] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 transition-colors duration-200">
      
      {/* Section Header with Indicator */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-gold-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Explore 8 Administrative Divisions of Bangladesh
          </span>
        </div>
        
        {/* Navigation Arrows for Smooth Scrolling */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all ${
              canScrollLeft ? 'hover:bg-slate-950 hover:text-white dark:hover:bg-gold-500 dark:hover:text-slate-950 opacity-100 shadow-sm' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all ${
              canScrollRight ? 'hover:bg-slate-950 hover:text-white dark:hover:bg-gold-500 dark:hover:text-slate-950 opacity-100 shadow-sm' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8 Divisions Bar with Smooth Scrolling & Edge Indicators */}
      <div className="relative group">
        
        {/* Left Fade Mask */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Right Fade Mask */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          className="flex items-center lg:flex-wrap gap-2.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {/* 'All Bangladesh' Option */}
          <button
            onClick={() => {
              setSelectedDivision('All');
              setSelectedSubZone('All');
            }}
            className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border shadow-sm ${
              selectedDivision === 'All'
                ? 'bg-slate-950 text-white border-slate-950 dark:bg-gradient-to-r dark:from-amber-500 dark:via-gold-500 dark:to-amber-400 dark:text-slate-950 dark:border-gold-400 dark:shadow-glow-gold'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>All Bangladesh</span>
            <span
              className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-lg ${
                selectedDivision === 'All'
                  ? 'bg-white/20 text-white dark:bg-black/25 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 dark:bg-gold-500/10 dark:text-gold-400 dark:border dark:border-gold-500/20'
              }`}
            >
              {Object.values(divisionStats).reduce((a, b) => a + b, 0)}
            </span>
          </button>

          {/* All 8 Administrative Divisions */}
          {BANGLADESH_DIVISIONS.map((div) => {
            const isSelected = selectedDivision === div;
            const count = divisionStats[div] !== undefined ? divisionStats[div] : 2;

            return (
              <button
                key={div}
                onClick={() => {
                  setSelectedDivision(div);
                  setSelectedSubZone('All');
                }}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border shadow-sm ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-950 dark:bg-gradient-to-r dark:from-amber-500 dark:via-gold-500 dark:to-amber-400 dark:text-slate-950 dark:border-gold-400 dark:shadow-glow-gold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                }`}
              >
                <span>{div}</span>
                <span
                  className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-lg ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-black/25 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 dark:bg-gold-500/10 dark:text-gold-400 dark:border dark:border-gold-500/20'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Zones Quick Bar */}
      <AnimatePresence mode="wait">
        {currentSubZones.length > 0 && (
          <motion.div
            key={selectedDivision}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          >
            <span className="text-[11px] font-extrabold text-gold-600 dark:text-gold-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              {selectedDivision} Hubs:
            </span>

            <button
              onClick={() => setSelectedSubZone('All')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                selectedSubZone === 'All'
                  ? 'bg-slate-950 text-white dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/40'
                  : 'text-slate-600 hover:text-slate-950 bg-white border border-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-white/[0.04] dark:border-transparent'
              }`}
            >
              All Neighborhoods
            </button>

            {currentSubZones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedSubZone(zone)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                  selectedSubZone === zone
                    ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 dark:shadow-glow-gold'
                    : 'text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/5'
                }`}
              >
                {zone}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
