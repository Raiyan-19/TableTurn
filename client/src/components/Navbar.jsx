import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed, 
  MapPin, 
  CalendarCheck, 
  User, 
  LogOut, 
  ChevronDown, 
  SlidersHorizontal, 
  ShieldCheck,
  Search,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { useTheme } from '../context/ThemeContext';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

export const Navbar = () => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { 
    selectedDivision, 
    setSelectedDivision, 
    setIsFilterDrawerOpen, 
    setIsBookingsDrawerOpen,
    setIsHostPortalOpen,
    setIsAdminModalOpen,
    myBookings,
    searchQuery,
    setSearchQuery 
  } = useReservation();

  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const divisionDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (divisionDropdownRef.current && !divisionDropdownRef.current.contains(e.target)) {
        setIsDivisionDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDivisionDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const confirmedBookingsCount = myBookings.filter(b => b.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#06080E]/90 backdrop-blur-md transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                  Table<span className="text-gold-500">Turn</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20">
                  BD
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                Resy-Style Dining Across 8 Divisions
              </p>
            </div>
          </a>

          {/* Division Selector Button (Desktop) */}
          <div ref={divisionDropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setIsDivisionDropdownOpen(!isDivisionDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-gold-500" />
              <span>{selectedDivision === 'All' ? 'All 8 Divisions' : `${selectedDivision} Division`}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDivisionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Division Dropdown */}
            <AnimatePresence>
              {isDivisionDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0E1320] p-2 shadow-2xl z-50 border border-slate-200 dark:border-gold-500/40"
                >
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 border-b border-slate-200 dark:border-white/10">
                    Select Division
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDivision('All');
                      setIsDivisionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between ${
                      selectedDivision === 'All' ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-800 dark:text-slate-300 hover:bg-gold-500/10'
                    }`}
                  >
                    <span>All Bangladesh</span>
                    {selectedDivision === 'All' && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </button>
                  <div className="my-1 border-t border-slate-200 dark:border-white/5" />
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDivision(div);
                        setIsDivisionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between ${
                        selectedDivision === div ? 'bg-gold-500 text-slate-950 font-bold' : 'text-slate-800 dark:text-slate-300 hover:bg-gold-500/10'
                      }`}
                    >
                      <span>{div} Division</span>
                      {selectedDivision === div && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gulshan fine dining, Mezban, Kacchi, Rooftops..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm transition-all"
            title={isDark ? 'Switch to Silk Light Mode' : 'Switch to Space Black Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Filter Drawer Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-colors"
            title="Open Advanced Filters"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Admin Dashboard Trigger */}
          {isAuthenticated && user?.role === 'admin' && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs font-bold text-gold-600 dark:text-gold-400 shadow-sm transition-colors"
              title="Open Admin Terminal"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          )}

          {/* My Bookings Trigger */}
          <button
            onClick={() => setIsBookingsDrawerOpen(true)}
            className="relative flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-colors"
            title="My Bookings"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">My Bookings</span>
            {confirmedBookingsCount > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-slate-950 text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-glow-gold">
                {confirmedBookingsCount}
              </span>
            )}
          </button>

          {/* User Auth Profile / Login */}
          {isAuthenticated ? (
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 sm:pr-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 shadow-sm transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[80px] sm:max-w-[90px] truncate hidden sm:inline">
                  {user?.name?.split(' ')[0] || 'Diner'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0E1320] p-2 shadow-2xl z-50 border border-slate-200 dark:border-gold-500/40"
                  >
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase font-bold text-gold-600 dark:text-gold-400 bg-gold-500/10 px-1.5 py-0.5 rounded">
                        {user?.role} Access
                      </span>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-300 hover:bg-gold-500/10 rounded-xl transition-colors flex items-center gap-2 mt-1"
                    >
                      <User className="w-4 h-4 text-gold-500" />
                      <span>Edit Account Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsBookingsDrawerOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-300 hover:bg-gold-500/10 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-500" />
                      <span>My Reservations</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-crimson-600 dark:text-crimson-400 hover:bg-crimson-500/10 rounded-xl transition-colors flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
