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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

export const Navbar = () => {
  const { user, isAuthenticated, openAuthModal, logout, demoLogin } = useAuth();
  const { 
    selectedDivision, 
    setSelectedDivision, 
    setIsFilterDrawerOpen, 
    setIsBookingsDrawerOpen,
    setIsHostPortalOpen,
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Table<span className="text-gold-500">Turn</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  BD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Resy-Style Dining Across 8 Divisions
              </p>
            </div>
          </a>

          {/* Division Selector Button (Desktop) */}
          <div ref={divisionDropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setIsDivisionDropdownOpen(!isDivisionDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-100/80 hover:bg-surface-50 border border-white/10 text-sm font-semibold text-slate-200 transition-colors"
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
                  className="absolute left-0 mt-2 w-56 rounded-xl glass-panel-gold p-2 shadow-2xl z-50 border border-gold-500/30"
                >
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gold-400/90 border-b border-white/10">
                    Select Division
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDivision('All');
                      setIsDivisionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                      selectedDivision === 'All' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>All Bangladesh</span>
                    {selectedDivision === 'All' && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                  </button>
                  <div className="my-1 border-t border-white/5" />
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setSelectedDivision(div);
                        setIsDivisionDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                        selectedDivision === div ? 'bg-gold-500/20 text-gold-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{div}</span>
                      {selectedDivision === div && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Bar Input (Desktop Center) */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Gulshan fine dining, Mezban, Kacchi, Rooftops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface-200/90 border border-white/10 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Advanced Filter Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            title="Filter by Price, Cuisine, Halal, Rooftop..."
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* My Bookings Trigger */}
          <button
            onClick={() => setIsBookingsDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-slate-200 transition-all hover:border-gold-500/40"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">My Bookings</span>
            {confirmedBookingsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black shadow-glow-emerald">
                {confirmedBookingsCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-surface-100 hover:bg-surface-50 border border-gold-500/30 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline text-xs font-semibold text-slate-200 pr-2 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl glass-panel-gold p-3 shadow-2xl z-50 border border-gold-500/30"
                  >
                    <div className="pb-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-gold-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                          {user.role} Member
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsBookingsDrawerOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                        My Reservations & QR Passes
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsHostPortalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-gold-300 hover:bg-gold-500/10 rounded-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        Host Stand & QR Scanner
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-crimson-400 hover:bg-crimson-500/10 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quick 1-Click Demo User */}
              <button
                onClick={() => demoLogin('user')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold transition-all"
                title="Instant Demo Session"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Demo User</span>
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
