import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  SearchX, 
  Sparkles, 
  RotateCcw,
  Utensils,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';
import { useReservation } from '../context/ReservationContext';
import { CUISINE_CATEGORIES, PRICE_TIERS } from '../data/mockData';
import { api } from '../services/api';

export const RestaurantGrid = () => {
  const {
    selectedDivision,
    selectedSubZone,
    selectedCuisine,
    setSelectedCuisine,
    selectedPrice,
    setSelectedPrice,
    searchQuery,
    setSearchQuery,
    mealWindow,
    sortBy,
    setSortBy,
    resetFilters,
    setIsFilterDrawerOpen,
  } = useReservation();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const cuisineScrollRef = useRef(null);

  const handleCuisineScroll = (direction) => {
    if (cuisineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      cuisineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch restaurants whenever filters update
  useEffect(() => {
    let isMounted = true;
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = {
          division: selectedDivision,
          subDistrict: selectedSubZone,
          cuisine: selectedCuisine,
          price: selectedPrice,
          search: searchQuery,
          sort: sortBy,
        };
        const res = await api.getRestaurants(params);
        if (isMounted && res.success) {
          setRestaurants(res.data);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchRestaurants, 150);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [selectedDivision, selectedSubZone, selectedCuisine, selectedPrice, searchQuery, sortBy]);

  const hasActiveFilters = 
    selectedDivision !== 'All' || 
    selectedSubZone !== 'All' || 
    selectedCuisine !== 'All Cuisines' || 
    selectedPrice !== 'All' || 
    searchQuery !== '';

  const sortOptions = [
    { label: 'Featured & Recommended', value: 'recommended' },
    { label: 'Highest Rated ⭐', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
  ];

  return (
    <section id="restaurant-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Cuisines Horizontal Filter Bar with Scroll Buttons */}
      <div className="relative border-b border-white/10 pb-3 flex items-center gap-2">
        <button
          onClick={() => handleCuisineScroll('left')}
          className="w-7 h-7 rounded-lg bg-surface-100 border border-white/10 hover:bg-gold-500 hover:text-slate-950 text-slate-300 flex items-center justify-center shrink-0 transition-all hidden sm:flex"
          title="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={cuisineScrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1 scroll-smooth"
        >
          {CUISINE_CATEGORIES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedCuisine === cuisine
                  ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 text-slate-950 font-extrabold border-gold-400 shadow-glow-gold'
                  : 'bg-surface-100 hover:bg-surface-50 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleCuisineScroll('right')}
          className="w-7 h-7 rounded-lg bg-surface-100 border border-white/10 hover:bg-gold-500 hover:text-slate-950 text-slate-300 flex items-center justify-center shrink-0 transition-all hidden sm:flex"
          title="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Controls Header: Counts, Active Filter Badges, Sort */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Results Count & Title */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>
              {selectedDivision === 'All' ? 'All Bangladesh Discoveries' : `${selectedDivision} Division Dining`}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
              {restaurants.length} {restaurants.length === 1 ? 'Venue' : 'Venues'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resy-style real-time slot allocation across all 8 administrative divisions
          </p>
        </div>

        {/* Sort & Advanced Filter Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          
          {/* Advanced Filter Drawer Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-400" />
            <span>All Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-400" />
              <span>Sort: {sortOptions.find((s) => s.value === sortBy)?.label.split(' ')[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl glass-panel-gold p-2 shadow-2xl z-50 border border-gold-500/30"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        sortBy === opt.value
                          ? 'bg-gold-500/20 text-gold-300'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>

          {selectedDivision !== 'All' && (
            <span className="px-2.5 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold flex items-center gap-1.5">
              Division: {selectedDivision}
            </span>
          )}

          {selectedSubZone !== 'All' && (
            <span className="px-2.5 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold flex items-center gap-1.5">
              Area: {selectedSubZone}
            </span>
          )}

          {selectedCuisine !== 'All Cuisines' && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              Cuisine: {selectedCuisine}
            </span>
          )}

          {selectedPrice !== 'All' && (
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              Price: {selectedPrice}
            </span>
          )}

          {searchQuery && (
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              Search: "{searchQuery}"
            </span>
          )}

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-crimson-400 hover:text-crimson-300 font-bold ml-2 underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* RESTAURANT GRID */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-3xl glass-panel border border-white/5 h-96 p-4 animate-pulse flex flex-col justify-between">
              <div className="w-full h-48 bg-white/5 rounded-2xl" />
              <div className="space-y-2 mt-4">
                <div className="w-3/4 h-5 bg-white/10 rounded" />
                <div className="w-1/2 h-4 bg-white/5 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="h-10 bg-white/5 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <motion.div 
          layout 
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-12 text-center rounded-3xl glass-panel border border-white/10 max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400 mb-4 shadow-glow-gold">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Matching Restaurants Found</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            We couldn't find any dining venues matching your current division, cuisine, or search criteria.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all"
          >
            Clear Filters & View All 8 Divisions
          </button>
        </motion.div>
      )}
    </section>
  );
};
