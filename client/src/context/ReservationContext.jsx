import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ReservationContext = createContext(null);

export const ReservationProvider = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  // Selected Filters State
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedSubZone, setSelectedSubZone] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealWindow, setMealWindow] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Reservation Modal Flow State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRestaurant, setBookingRestaurant] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Restaurant Detail Modal State
  const [detailRestaurant, setDetailRestaurant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // User Bookings Drawer State
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Host Stand & Admin Portal Modal States
  const [isHostPortalOpen, setIsHostPortalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.getMyReservations();
      if (res && res.success && Array.isArray(res.data)) {
        setMyBookings(res.data);
      } else {
        const local = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');
        setMyBookings(local);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');
      setMyBookings(local);
    } finally {
      setLoadingBookings(false);
    }
  };

  const openBookingModal = (restaurant, slot = null) => {
    if (!isAuthenticated) {
      showToast('Please sign in to make a table reservation.', 'error');
      openAuthModal('login');
      return;
    }

    setBookingRestaurant(restaurant);
    setSelectedSlot(slot || (restaurant.defaultSlots && restaurant.defaultSlots[0]) || { time: '07:30 PM', type: 'Main Dining' });
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingRestaurant(null);
    setSelectedSlot(null);
  };

  const openDetailModal = (restaurant) => {
    setDetailRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailRestaurant(null);
  };

  const resetFilters = () => {
    setSelectedDivision('All');
    setSelectedSubZone('All');
    setSelectedCuisine('All Cuisines');
    setSelectedPrice('All');
    setSearchQuery('');
    setMealWindow('all');
    setSelectedFeature('All');
    setSortBy('recommended');
  };

  return (
    <ReservationContext.Provider
      value={{
        selectedDivision,
        setSelectedDivision,
        selectedSubZone,
        setSelectedSubZone,
        selectedCuisine,
        setSelectedCuisine,
        selectedPrice,
        setSelectedPrice,
        searchQuery,
        setSearchQuery,
        partySize,
        setPartySize,
        selectedDate,
        setSelectedDate,
        mealWindow,
        setMealWindow,
        selectedFeature,
        setSelectedFeature,
        sortBy,
        setSortBy,
        resetFilters,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isBookingModalOpen,
        bookingRestaurant,
        selectedSlot,
        setSelectedSlot,
        openBookingModal,
        closeBookingModal,
        detailRestaurant,
        isDetailModalOpen,
        openDetailModal,
        closeDetailModal,
        isBookingsDrawerOpen,
        setIsBookingsDrawerOpen,
        isHostPortalOpen,
        setIsHostPortalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        myBookings,
        setMyBookings,
        fetchMyBookings,
        loadingBookings,
        toast,
        showToast,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);

