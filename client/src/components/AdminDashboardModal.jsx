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
  QrCode,
  Plus,
  Trash2,
  Edit,
  Flame,
  Star,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

export const AdminDashboardModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast, setIsProfileModalOpen } = useReservation();

  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'overview' | 'lookup' | 'restaurants'
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

  // Add Restaurant Modal State
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestTagline, setNewRestTagline] = useState('');
  const [newRestDivision, setNewRestDivision] = useState('Dhaka');
  const [newRestSubDistrict, setNewRestSubDistrict] = useState('Gulshan');
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestCuisines, setNewRestCuisines] = useState('Bengali Fine Dining, Pan-Asian');
  const [newRestPrice, setNewRestPrice] = useState('৳৳');
  const [newRestCostForTwo, setNewRestCostForTwo] = useState(1600);
  const [newRestPhoto, setNewRestPhoto] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80');
  const [addingRestaurant, setAddingRestaurant] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, filterDivision, filterStatus]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDivision !== 'All') params.division = filterDivision;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const resvRes = await api.getAdminReservations(params);
      if (resvRes.success && Array.isArray(resvRes.data)) {
        setReservations(resvRes.data);
      }

      const statsRes = await api.getAdminStats();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

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

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestName.trim() || !newRestAddress.trim()) {
      showToast('Please enter restaurant name and full address', 'error');
      return;
    }

    setAddingRestaurant(true);
    try {
      const payload = {
        name: newRestName.trim(),
        tagline: newRestTagline.trim() || 'Curated dining experience in Bangladesh',
        division: newRestDivision,
        subDistrict: newRestSubDistrict.trim(),
        address: newRestAddress.trim(),
        cuisineTypes: newRestCuisines.split(',').map((c) => c.trim()).filter(Boolean),
        priceCategory: newRestPrice,
        averageCostForTwo: Number(newRestCostForTwo) || 1500,
        photos: [newRestPhoto.trim()],
        features: ['Halal Certified', 'Air Conditioned', 'WiFi'],
        signatureDishes: [
          { name: 'Chef Special Platter', priceBDT: 1200, description: 'Artisanal grilled prime selection', isChefSpecial: true },
        ],
      };

      const res = await api.createRestaurant(payload);
      if (res.success) {
        showToast(`Restaurant '${res.data.name}' successfully listed!`);
        setIsAddRestaurantOpen(false);
        setNewRestName('');
        setNewRestTagline('');
        setNewRestAddress('');
        loadDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create restaurant', 'error');
    } finally {
      setAddingRestaurant(false);
    }
  };

  const handleDeleteRestaurant = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}' from TableTurn?`)) {
      return;
    }
    try {
      const res = await api.deleteRestaurant(id);
      if (res.success) {
        showToast(`Restaurant '${name}' removed successfully`);
        setRestaurantsList((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete restaurant', 'error');
    }
  };

  const handleToggleOffer = async (id, currentOffer, name) => {
    try {
      const newHasOffer = !currentOffer?.hasOffer;
      const offerPayload = {
        hasOffer: newHasOffer,
        discountPercent: newHasOffer ? 30 : 0,
        tag: newHasOffer ? '30% OFF Flash Deal' : '',
        expiryTime: '11:00 PM',
      };

      const res = await api.toggleRestaurantOffer(id, offerPayload);
      if (res.success) {
        showToast(newHasOffer ? `30% OFF Flash Deal activated for ${name}!` : `Flash Deal deactivated for ${name}`);
        setRestaurantsList((prev) =>
          prev.map((r) => (r._id === id || r.id === id ? { ...r, offer: offerPayload } : r))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update offer', 'error');
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
          className="relative w-full max-w-6xl max-h-[92vh] bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-gold-500/40 p-4 sm:p-6 shadow-2xl z-10 flex flex-col overflow-hidden text-slate-900 dark:text-white transition-colors duration-200"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gold-500/20 border border-gold-500/50 flex items-center justify-center text-amber-600 dark:text-gold-400 shadow-glow-gold">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-amber-700 dark:text-gold-400 border border-gold-500/30">
                    {user?.role === 'admin' ? 'Super Administrator' : 'Venue Manager'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Authenticated: {user?.email}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white font-display">
                  TableTurn Bangladesh — Management Terminal
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs font-bold text-amber-700 dark:text-gold-400 transition-colors shadow-sm"
                title="Edit Account & Personal Information"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Profile</span>
              </button>

              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-200 dark:border-white/5 shrink-0 overflow-x-auto">
            {[
              { id: 'reservations', label: 'All Reservations', icon: Users },
              { id: 'restaurants', label: 'Venues & Flash Offers', icon: Building2 },
              { id: 'overview', label: 'Analytics & KPIs', icon: TrendingUp },
              { id: 'lookup', label: 'Host Stand Scanner', icon: QrCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-gold-500 dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'
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
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Guest Name, Phone, Code (e.g. TT-DHK-...)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadDashboardData()}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500/60 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer shadow-sm"
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
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer shadow-sm"
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
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-200 shadow-sm">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-surface-100 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-gold-400 border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="px-4 py-3">Code & Venue</th>
                        <th className="px-4 py-3">Primary Guest</th>
                        <th className="px-4 py-3">Date & Slot</th>
                        <th className="px-4 py-3">Party & Area</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                            {loading ? 'Fetching real-time reservations...' : 'No reservations match the selected criteria.'}
                          </td>
                        </tr>
                      ) : (
                        reservations.map((resv) => (
                          <tr key={resv._id || resv.reservationCode} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-amber-600 dark:text-gold-400 block">{resv.reservationCode}</span>
                              <span className="text-[11px] text-slate-900 dark:text-white font-semibold">{resv.restaurantName}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{resv.division}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-900 dark:text-white block">{resv.guestName}</span>
                              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">{resv.guestPhone}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-[150px]">{resv.guestEmail}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-semibold text-slate-900 dark:text-white block flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-500 dark:text-gold-400" /> {resv.date}
                              </span>
                              <span className="font-bold text-amber-700 dark:text-gold-300 block flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-amber-500 dark:text-gold-400" /> {resv.timeSlot}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-900 dark:text-white">{resv.partySize} Guests</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{resv.seatingArea}</span>
                            </td>

                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                resv.status === 'seated'
                                  ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30'
                                  : resv.status === 'confirmed'
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-700 dark:text-crimson-400 border border-rose-500/30'
                              }`}>
                                {resv.status}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {resv.status !== 'seated' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'seated')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/40 transition-colors"
                                  >
                                    Seat Guest
                                  </button>
                                )}
                                {resv.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'confirmed')}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-gold-300 text-[10px] font-bold border border-amber-500/40 transition-colors"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {resv.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleStatusUpdate(resv._id || resv.reservationCode, 'cancelled')}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-crimson-300 text-[10px] font-bold border border-rose-500/40 transition-colors"
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

            {/* ================= TAB 2: VENUES & RESTAURANT MANAGEMENT ================= */}
            {activeTab === 'restaurants' && (
              <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Partner Dining Venues ({restaurantsList.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage listings, menu highlights & last-minute flash deals</p>
                  </div>

                  <button
                    onClick={() => setIsAddRestaurantOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>List New Restaurant</span>
                  </button>
                </div>

                {/* Grid of Restaurants */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurantsList.map((rest) => {
                    const restId = rest._id || rest.id;
                    const hasOffer = rest.offer?.hasOffer;

                    return (
                      <div
                        key={restId}
                        className="p-4 rounded-2xl bg-white dark:bg-surface-200 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-3 group hover:border-amber-400 dark:hover:border-gold-500/40 transition-all shadow-sm hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:bg-gold-500/10 dark:text-gold-400 border border-amber-500/20 dark:border-gold-500/20">
                              {rest.division}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-gold-400 text-amber-500 dark:text-gold-400" /> {rest.rating || 4.8}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                            {rest.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{rest.address}</p>

                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded font-medium">
                              ~৳{rest.averageCostForTwo} for two
                            </span>
                            <span className="text-[10px] text-amber-700 dark:text-gold-400 bg-amber-500/10 dark:bg-gold-500/10 px-2 py-0.5 rounded font-semibold">
                              {rest.priceCategory || '৳৳'}
                            </span>
                          </div>
                        </div>

                        {/* Flash Deal & Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                          {/* Flash Deal Toggle */}
                          <button
                            onClick={() => handleToggleOffer(restId, rest.offer, rest.name)}
                            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              hasOffer
                                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-surface-100 dark:hover:bg-surface-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                            }`}
                          >
                            <Flame className={`w-3.5 h-3.5 ${hasOffer ? 'fill-white text-white' : 'text-slate-400'}`} />
                            <span>{hasOffer ? `Active: 30% OFF Flash Deal` : `Enable 30% Flash Offer`}</span>
                          </button>

                          {/* Delete Action */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteRestaurant(restId, rest.name)}
                              className="text-[11px] text-rose-600 dark:text-crimson-400 hover:text-rose-700 dark:hover:text-crimson-300 font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Venue</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 3: OVERVIEW & ANALYTICS ================= */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {/* Total Reservations */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:from-gold-500/10 dark:via-white/[0.03] dark:to-transparent bg-white dark:bg-surface-200 border border-amber-300/70 dark:border-gold-500/30 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-700 dark:text-gold-400 uppercase tracking-wider">Total Reservations</span>
                      <Users className="w-4 h-4 text-amber-600 dark:text-gold-400 opacity-75" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-display">
                      {stats?.totalBookings || reservations.length}
                    </p>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-gold-400 mt-1 block">Platform Lifetime</span>
                  </div>

                  {/* Active Confirmed */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white dark:from-emerald-500/15 dark:via-white/[0.03] dark:to-transparent bg-white dark:bg-surface-200 border border-emerald-300/80 dark:border-emerald-500/30 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Active Confirmed</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-75" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-2 font-display">
                      {stats?.confirmedCount || 0}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Upcoming Diners</span>
                  </div>

                  {/* Seated & Dining */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-white dark:from-sky-500/15 dark:via-white/[0.03] dark:to-transparent bg-white dark:bg-surface-200 border border-sky-300/80 dark:border-sky-500/30 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-sky-700 dark:text-sky-400 uppercase tracking-wider">Seated & Dining</span>
                      <Utensils className="w-4 h-4 text-sky-600 dark:text-sky-400 opacity-75" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-sky-300 mt-2 font-display">
                      {stats?.seatedCount || 0}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">Currently at Table</span>
                  </div>

                  {/* Partner Venues */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-white dark:from-purple-500/15 dark:via-white/[0.03] dark:to-transparent bg-white dark:bg-surface-200 border border-violet-300/80 dark:border-purple-500/30 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-violet-700 dark:text-purple-300 uppercase tracking-wider">Partner Venues</span>
                      <Building2 className="w-4 h-4 text-violet-600 dark:text-purple-300 opacity-75" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-violet-800 dark:text-purple-200 mt-2 font-display">
                      {stats?.totalRestaurants || restaurantsList.length}
                    </p>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-gold-400 mt-1 block">8 BD Divisions</span>
                  </div>
                </div>

                {/* Division Distribution */}
                <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-surface-200 border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3.5">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Reservations Distribution by Bangladesh Division
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Live Breakdown
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BANGLADESH_DIVISIONS.map((div) => {
                      const count = stats?.divisionBreakdown?.[div] || reservations.filter((r) => r.division === div).length;
                      return (
                        <div 
                          key={div} 
                          className="p-3.5 rounded-xl bg-white dark:bg-surface-100 border border-slate-200/90 dark:border-white/5 shadow-xs hover:border-amber-400/60 dark:hover:border-gold-500/40 hover:shadow-sm transition-all group"
                        >
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block group-hover:text-amber-700 dark:group-hover:text-gold-300 transition-colors">{div}</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-0.5">{count} Bookings</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: HOST STAND SCANNER ================= */}
            {activeTab === 'lookup' && (
              <div className="max-w-xl mx-auto space-y-4">
                <form onSubmit={handleLookup} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-gold-400 block">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500/60 uppercase shadow-inner"
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
                  <div className="p-3.5 rounded-xl bg-rose-500/10 dark:bg-crimson-500/20 border border-rose-500/30 dark:border-crimson-500/40 text-rose-700 dark:text-crimson-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{lookupError}</span>
                  </div>
                )}

                {lookupResult && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-surface-200 border border-amber-300 dark:border-gold-500/40 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Reservation Code</span>
                        <p className="font-mono text-base font-extrabold text-amber-600 dark:text-gold-400">{lookupResult.reservationCode}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        lookupResult.status === 'seated'
                          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30'
                          : lookupResult.status === 'confirmed'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-crimson-400 border border-rose-500/30'
                      }`}>
                        {lookupResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Guest Name</span>
                        <span className="font-bold text-slate-900 dark:text-white">{lookupResult.guestName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Contact</span>
                        <span className="font-mono text-slate-700 dark:text-slate-200">{lookupResult.guestPhone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Allocated Time</span>
                        <span className="font-bold text-amber-700 dark:text-gold-300">{lookupResult.date} at {lookupResult.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Party & Seating</span>
                        <span className="font-bold text-slate-900 dark:text-white">{lookupResult.partySize} Guests • {lookupResult.seatingArea}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusUpdate(lookupResult._id || lookupResult.reservationCode, 'seated')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Seat Table & Check In</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <span>Bangladesh Dining Administration Engine v3.0</span>
            <span className="text-amber-700 dark:text-gold-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 8 Administrative Divisions Active
            </span>
          </div>

        </motion.div>
      </div>

      {/* ================= MODAL: ADD NEW RESTAURANT ================= */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setIsAddRestaurantOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white dark:bg-[#0E1320] text-slate-900 dark:text-white rounded-3xl p-6 border border-slate-200 dark:border-gold-500/50 max-w-xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-gold-400">Admin Restaurant CRUD</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">List New Partner Restaurant</h3>
              </div>
              <button
                onClick={() => setIsAddRestaurantOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Glasshouse Fine Dining"
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Modern artisanal Pan-Asian cuisine"
                  value={newRestTagline}
                  onChange={(e) => setNewRestTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Division *</label>
                  <select
                    value={newRestDivision}
                    onChange={(e) => setNewRestDivision(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d} value={d} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Neighborhood / Zone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gulshan 2, GEC, Zindabazar"
                    value={newRestSubDistrict}
                    onChange={(e) => setNewRestSubDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Full Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Road 45, House 12, Gulshan 2, Dhaka"
                  value={newRestAddress}
                  onChange={(e) => setNewRestAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Price Tier & Cost for Two (৳)</label>
                  <div className="flex gap-2">
                    <select
                      value={newRestPrice}
                      onChange={(e) => setNewRestPrice(e.target.value)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-amber-600 dark:text-gold-400 font-bold"
                    >
                      <option value="৳">৳ (Budget)</option>
                      <option value="৳৳">৳৳ (Moderate)</option>
                      <option value="৳৳৳">৳৳৳ (Fine Dining)</option>
                      <option value="৳৳৳৳">৳৳৳৳ (Luxury)</option>
                    </select>
                    <input
                      type="number"
                      value={newRestCostForTwo}
                      onChange={(e) => setNewRestCostForTwo(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Cuisines (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Bengali, Continental, Steakhouse"
                    value={newRestCuisines}
                    onChange={(e) => setNewRestCuisines(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Photo URL</label>
                <input
                  type="text"
                  value={newRestPhoto}
                  onChange={(e) => setNewRestPhoto(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-surface-200 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[11px]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-100 dark:hover:bg-surface-50 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingRestaurant}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-bold shadow-glow-gold transition-all"
                >
                  {addingRestaurant ? 'Listing Venue...' : 'Save & Publish Listing'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
