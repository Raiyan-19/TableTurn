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
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Filter Discoveries</h3>
                    <p className="text-[11px] text-slate-400">Refine by division, cuisine & price</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Administrative Division */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Division (All 8 BD Regions)
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDivision('All');
                      setSelectedSubZone('All');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      selectedDivision === 'All'
                        ? 'bg-gold-500 text-slate-950 font-bold'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
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
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        selectedDivision === div
                          ? 'bg-gold-500 text-slate-950 font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sub-Zones / Neighborhoods */}
              {currentSubZones.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    {selectedDivision} Hubs & Sub-Zones
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedSubZone('All')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedSubZone === 'All'
                          ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      All Areas
                    </button>
                    {currentSubZones.map((zone) => (
                      <button
                        key={zone}
                        onClick={() => setSelectedSubZone(zone)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedSubZone === zone
                            ? 'bg-gold-500 text-slate-950 font-bold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Price Category */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Price Tier (BDT ৳)
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                  {PRICE_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setSelectedPrice(tier.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                        selectedPrice === tier.value
                          ? 'bg-gold-500 text-slate-950 font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Culinary Genre */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Cuisine
                </label>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {CUISINE_CATEGORIES.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCuisine === cuisine
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Special Features & Ambiance */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Special Features
                </label>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {FEATURE_LIST.map((feat) => (
                    <button
                      key={feat}
                      onClick={() => setSelectedFeature(selectedFeature === feat ? 'All' : feat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selectedFeature === feat
                          ? 'bg-gold-500 text-slate-950 font-bold shadow-glow-gold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {selectedFeature === feat && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{feat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all"
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
