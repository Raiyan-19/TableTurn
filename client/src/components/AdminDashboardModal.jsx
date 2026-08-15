import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Search, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  MapPin, 
  RefreshCw, 
  TrendingUp, 
  Utensils, 
  Filter,
  Sparkles,
  QrCode
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

export const AdminDashboardModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useReservation();

  const [activeTab, setActiveTab] = useState('reservations'); // 'overview' | 'reservations' | 'restaurants' | 'lookup'
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [filterDivision, setFilterDivision] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lookup Tool States
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, filterDivision, filterStatus]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Load All Platform Reservations
      const params = {};
      if (filterDivision !== 'All') params.division = filterDivision;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const resvRes = await api.getAdminReservations(params);
      if (resvRes.success && Array.isArray(resvRes.data)) {
        setReservations(resvRes.data);
      }

      // 2. Load Stats
      const statsRes = await api.getAdminStats();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      // 3. Load Restaurants
      const restRes = await api.getRestaurants();
      if (restRes.success && Array.isArray(restRes.data)) {
        setRestaurantsList(restRes.data);
      }
    } catch (err) {
      console.error('Admin dashboard load error:', err);
      showToast(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateAdminReservationStatus(id, newStatus);
      showToast(`Reservation status updated to '${newStatus}'!`);
      // Update local state immediately
      setReservations((prev) =>
        prev.map((r) => (r._id === id || r.reservationCode === id ? { ...r, status: newStatus } : r))
      );
      if (lookupResult && (lookupResult._id === id || lookupResult.reservationCode === id)) {
        setLookupResult({ ...lookupResult, status: newStatus });
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;

    setLookupLoading(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const clean = lookupCode.trim().toUpperCase();
      const res = await api.lookupReservation(clean);
      if (res.success && res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError(`No active reservation found with code "${clean}".`);
      }
    } catch (err) {
      setLookupError(err.message || 'Lookup failed. Please verify code.');
    } finally {
      setLookupLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Full Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-surface-300 rounded-3xl border border-gold-500/40 p-4 sm:p-6 shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-gold-400 shadow-glow-gold">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30">
                    {user?.role === 'admin' ? 'Super Administrator' : 'Venue Manager'}
                  </span>
                  <span className="text-xs text-slate-400">Authenticated: {user?.email}</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display">
                  TableTurn Bangladesh — Management Terminal
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 pb-3 border-b border-white/5 shrink-0 overflow-x-auto">
            {[
              { id: 'reservations', label: 'All Reservations', icon: Users },
              { id: 'overview', label: 'Analytics & KPIs', icon: TrendingUp },
              { id: 'lookup', label: 'Host Stand Scanner', icon: QrCode },
              { id: 'restaurants', label: 'Venues Directory', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-gold-500 text-slate-950 shadow-glow-gold'
                      : 'bg-surface-200/80 text-slate-300 hover:bg-surface-100 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Tab Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            
            {/* ================= TAB 1: ALL RESERVATIONS ================= */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="p-3 rounded-2xl bg-surface-200 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Guest Name, Phone, Code (e.g. TT-DHK-...)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadDashboardData()}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-bold text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="seated">Seated</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Division Filter */}
                    <select
                      value={filterDivision}
                      onChange={(e) => setFilterDivision(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-surface-100 border border-white/10 text-xs font-bold text-white focus:outline-none cursor-pointer"
                    >
                      <option value="All">All 8 Divisions</option>
                      {BANGLADESH_DIVISIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <button
                      onClick={loadDashboardData}
                      className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-colors"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* Reservations Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-200">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-surface-100 text-[10px] font-extrabold uppercase tracking-wider text-gold-400 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Code & Venue</th>
                        <th className="px-4 py-3">Primary Guest</th>
                        <th className="px-4 py-3">Date & Slot</th>
                        <th className="px-4 py-3">Party & Area</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                            {loading ? 'Fetching real-time reservations...' : 'No reservations match the selected criteria.'}
                          </td>
                        </tr>
                      ) : (
                        reservations.map((resv) => (
                          <tr key={resv._id || resv.reservationCode} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-gold-400 block">{resv.reservationCode}</span>
                              <span className="text-[11px] text-white font-semibold">{resv.restaurantName}</span>
                              <span className="text-[10px] text-slate-400 block">{resv.division}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-white block">{resv.guestName}</span>
                              <span className="font-mono text-[11px] text-slate-400 block">{resv.guestPhone}</span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">{resv.guestEmail}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-semibold text-white block flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gold-400" /> {resv.date}
                              </span>
                              <span className="font-bold text-gold-300 block flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-gold-400" /> {resv.timeSlot}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-white">{resv.partySize} Guests</span>
                              <span className="text-[10px] text-slate-400 block">{resv.seatingArea}</span>
                              {resv.occasion && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 inline-block mt-1">
                                  {resv.occasion}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                resv.status === 'seated'
                                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                  : resv.status === 'confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-crimson-500/20 text-crimson-400 border border-crimson-500/30'
                              }`}>
                                {resv.status}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {resv.status !== 'seated' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'seated')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 transition-colors"
                                    title="Seat table and check in guest"
                                  >
                                    Seat Guest
                                  </button>
                                )}
                                {resv.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'confirmed')}
                                    className="px-2.5 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-[10px] font-bold border border-gold-500/40 transition-colors"
                                    title="Mark confirmed"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {resv.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'cancelled')}
                                    className="px-2.5 py-1 rounded-lg bg-crimson-500/20 hover:bg-crimson-500/30 text-crimson-300 text-[10px] font-bold border border-crimson-500/40 transition-colors"
                                    title="Cancel reservation"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB 2: OVERVIEW & ANALYTICS ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-surface-200 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reservations</span>
                    <p className="text-2xl font-extrabold text-white mt-1">{stats?.totalBookings || reservations.length}</p>
                    <span className="text-[10px] text-gold-400 mt-1 block">Platform Lifetime</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-200 border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Active Confirmed</span>
                    <p className="text-2xl font-extrabold text-emerald-300 mt-1">{stats?.confirmedCount || 0}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Upcoming Diners</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-200 border border-sky-500/30">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">Seated & Dining</span>
                    <p className="text-2xl font-extrabold text-sky-300 mt-1">{stats?.seatedCount || 0}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Currently at Table</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-200 border border-white/10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Partner Venues</span>
                    <p className="text-2xl font-extrabold text-white mt-1">{stats?.totalRestaurants || restaurantsList.length}</p>
                    <span className="text-[10px] text-gold-400 mt-1 block">8 BD Divisions</span>
                  </div>
                </div>

                {/* Division Distribution */}
                <div className="p-5 rounded-2xl bg-surface-200 border border-white/10">
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                    Reservations Distribution by Bangladesh Division
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BANGLADESH_DIVISIONS.map((div) => {
                      const count = stats?.divisionBreakdown?.[div] || reservations.filter((r) => r.division === div).length;
                      return (
                        <div key={div} className="p-3 rounded-xl bg-surface-100 border border-white/5">
                          <span className="text-[10px] font-bold text-slate-400 block">{div}</span>
                          <span className="text-lg font-extrabold text-white">{count} Bookings</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: HOST STAND SCANNER ================= */}
            {activeTab === 'lookup' && (
              <div className="max-w-xl mx-auto space-y-4">
                <form onSubmit={handleLookup} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
                    Verify Guest QR Code / Booking Reference
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. TT-DHK-4892"
                        value={lookupCode}
                        onChange={(e) => setLookupCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/60 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={lookupLoading}
                      className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all"
                    >
                      {lookupLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </form>

                {lookupError && (
                  <div className="p-3.5 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{lookupError}</span>
                  </div>
                )}

                {lookupResult && (
                  <div className="p-5 rounded-2xl bg-surface-200 border border-gold-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Reservation Code</span>
                        <p className="font-mono text-base font-extrabold text-gold-400">{lookupResult.reservationCode}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        lookupResult.status === 'seated'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : lookupResult.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-crimson-500/20 text-crimson-400 border border-crimson-500/30'
                      }`}>
                        {lookupResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Guest Name</span>
                        <span className="font-bold text-white">{lookupResult.guestName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Contact</span>
                        <span className="font-mono text-slate-200">{lookupResult.guestPhone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Allocated Time</span>
                        <span className="font-bold text-gold-300">{lookupResult.date} at {lookupResult.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Party & Seating</span>
                        <span className="font-bold text-white">{lookupResult.partySize} Guests • {lookupResult.seatingArea}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusUpdate(lookupResult._id || lookupResult.reservationCode, 'seated')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Seat Table & Check In</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 4: RESTAURANTS DIRECTORY ================= */}
            {activeTab === 'restaurants' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {restaurantsList.map((rest) => (
                  <div key={rest._id || rest.id} className="p-4 rounded-2xl bg-surface-200 border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gold-400 uppercase">{rest.division}</span>
                        <span className="text-xs font-bold text-white">⭐ {rest.rating}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{rest.name}</h4>
                      <p className="text-[11px] text-slate-400">{rest.address}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[11px] flex items-center justify-between text-slate-300">
                      <span>Avg: ৳{rest.averageCostForTwo} for two</span>
                      <span className="text-gold-400 font-semibold">{rest.cuisineTypes?.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span>Bangladesh Dining Administration Engine v3.0</span>
            <span className="text-gold-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 8 Administrative Divisions Active
            </span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
