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
    <section id="restaurant-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-200">
      
      {/* Cuisines Horizontal Filter Bar with Scroll Buttons */}
      <div className="relative border-b border-slate-200 dark:border-white/10 pb-4 flex items-center gap-2">
        <button
          onClick={() => handleCuisineScroll('left')}
          className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:bg-slate-950 hover:text-white dark:hover:bg-gold-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-sm transition-all hidden sm:flex"
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border shadow-sm ${
                selectedCuisine === cuisine
                  ? 'bg-slate-950 text-white border-slate-950 dark:bg-gradient-to-r dark:from-amber-500 dark:via-gold-500 dark:to-amber-400 dark:text-slate-950 dark:border-gold-400 dark:shadow-glow-gold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleCuisineScroll('right')}
          className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:bg-slate-950 hover:text-white dark:hover:bg-gold-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-sm transition-all hidden sm:flex"
          title="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Controls Header: Counts, Active Filter Badges, Sort */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Results Count & Gradient Title */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-amber-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {selectedDivision === 'All' ? 'All Bangladesh Discoveries' : `${selectedDivision} Division Dining`}
            </span>
            <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-slate-950 text-white dark:bg-gold-500/15 dark:text-gold-400 dark:border dark:border-gold-500/30 shadow-sm">
              {restaurants.length} {restaurants.length === 1 ? 'Venue' : 'Venues'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Resy-style real-time slot allocation across all 8 administrative divisions
          </p>
        </div>

        {/* Sort & Advanced Filter Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          
          {/* Advanced Filter Drawer Trigger */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-slate-200 dark:border-white/10 text-xs font-bold shadow-sm transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span>All Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-slate-200 dark:border-white/10 text-xs font-bold shadow-sm transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-500" />
              <span>Sort: {sortOptions.find((s) => s.value === sortBy)?.label.split(' ')[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#0E1320] p-2 shadow-xl z-50 border border-slate-200 dark:border-gold-500/40"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        sortBy === opt.value
                          ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 font-bold'
                          : 'text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gold-500/10'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-950" />}
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
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active:</span>

          {selectedDivision !== 'All' && (
            <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm dark:bg-gold-500/10 dark:border dark:border-gold-500/30 dark:text-gold-400">
              Division: {selectedDivision}
            </span>
          )}

          {selectedSubZone !== 'All' && (
            <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm dark:bg-gold-500/10 dark:border dark:border-gold-500/30 dark:text-gold-400">
              Area: {selectedSubZone}
            </span>
          )}

          {selectedCuisine !== 'All Cuisines' && (
            <span className="px-3 py-1 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm dark:bg-emerald-500/10 dark:border dark:border-emerald-500/30 dark:text-emerald-400">
              Cuisine: {selectedCuisine}
            </span>
          )}

          {selectedPrice !== 'All' && (
            <span className="px-3 py-1 rounded-xl bg-indigo-700 text-white text-xs font-bold shadow-sm dark:bg-indigo-500/10 dark:border dark:border-indigo-500/30 dark:text-indigo-300">
              Price: {selectedPrice}
            </span>
          )}

          {searchQuery && (
            <span className="px-3 py-1 rounded-xl bg-purple-700 text-white text-xs font-bold shadow-sm dark:bg-purple-500/10 dark:border dark:border-purple-500/30 dark:text-purple-300">
              Search: "{searchQuery}"
            </span>
          )}

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-crimson-600 dark:text-crimson-400 hover:text-crimson-500 font-bold ml-2 underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* RESTAURANT GRID */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/5 h-96 p-4 animate-pulse flex flex-col justify-between">
              <div className="w-full h-48 bg-slate-200 dark:bg-white/5 rounded-2xl" />
              <div className="space-y-2 mt-4">
                <div className="w-3/4 h-5 bg-slate-300 dark:bg-white/10 rounded" />
                <div className="w-1/2 h-4 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl" />
                <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl" />
                <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <motion.div 
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
          className="mt-12 p-12 text-center rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 max-w-xl mx-auto flex flex-col items-center shadow-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4 shadow-glow-gold">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">No Matching Restaurants Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            We couldn't find any dining venues matching your current division, cuisine, or search criteria.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 rounded-xl bg-slate-950 text-white dark:bg-gradient-to-r dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            Clear Filters & View All 8 Divisions
          </button>
        </motion.div>
      )}
    </section>
  );
};
