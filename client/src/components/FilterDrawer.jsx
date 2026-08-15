import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { 
  BANGLADESH_DIVISIONS, 
  DIVISION_SUBZONES, 
  CUISINE_CATEGORIES, 
  PRICE_TIERS 
} from '../data/mockData';

const FEATURE_LIST = [
  'Halal Certified',
  'Rooftop View',
  'Outdoor Seating',
  'Valet Parking',
  'Private Dining Room',
  'Live Sushi Counter',
  'Wood-Fired Oven',
  'Family Friendly',
  'Waterfront View',
  'Air Conditioned',
];

export const FilterDrawer = () => {
  const {
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    selectedDivision,
    setSelectedDivision,
    selectedSubZone,
    setSelectedSubZone,
    selectedCuisine,
    setSelectedCuisine,
    selectedPrice,
    setSelectedPrice,
    selectedFeature,
    setSelectedFeature,
    resetFilters,
  } = useReservation();

  const currentSubZones = selectedDivision !== 'All' ? DIVISION_SUBZONES[selectedDivision] || [] : [];

  return (
    <AnimatePresence>
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0B0F19] border-l border-slate-200 dark:border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 transition-colors duration-200"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center text-amber-600 dark:text-gold-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">Filter Discoveries</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Refine by division, cuisine & price</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Administrative Division */}
              <div className="mt-5">
                <label className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400">
                  Division (All 8 BD Regions)
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDivision('All');
                      setSelectedSubZone('All');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                      selectedDivision === 'All'
                        ? 'bg-slate-950 text-white border-slate-950 dark:bg-gold-500 dark:text-slate-950 dark:border-gold-400 font-bold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300'
                    }`}
                  >
                    All Bangladesh
                  </button>
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDivision(div);
                        setSelectedSubZone('All');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                        selectedDivision === div
                          ? 'bg-slate-950 text-white border-slate-950 dark:bg-gold-500 dark:text-slate-950 dark:border-gold-400 font-bold shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.1 Sub-zones (Visible if a division is picked) */}
              {currentSubZones.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400">
                    {selectedDivision} Hubs
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                    <button
                      onClick={() => setSelectedSubZone('All')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        selectedSubZone === 'All'
                          ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-transparent'
                      }`}
                    >
                      All
                    </button>
                    {currentSubZones.map((zone) => (
                      <button
                        key={zone}
                        onClick={() => setSelectedSubZone(zone)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          selectedSubZone === zone
                            ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 font-bold'
                            : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-transparent'
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Price Tier */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400">
                  Price Tier (BDT ৳)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {PRICE_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setSelectedPrice(tier.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                        selectedPrice === tier.value
                          ? 'bg-slate-950 text-white border-slate-950 dark:bg-gold-500 dark:text-slate-950 dark:border-gold-400 font-bold shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cuisine Category */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400">
                  Cuisine
                </label>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {CUISINE_CATEGORIES.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                        selectedCuisine === cuisine
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Dining Features */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400">
                  Special Features
                </label>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {FEATURE_LIST.map((feat) => {
                    const isSelected = selectedFeature === feat;
                    return (
                      <button
                        key={feat}
                        onClick={() => setSelectedFeature(isSelected ? 'All' : feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200/80 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 text-xs font-black shadow-glow-gold transition-all"
              >
                Apply Filters
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
