import axios from 'axios';
import { INITIAL_RESTAURANTS, BANGLADESH_DIVISIONS } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to outgoing requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tableturn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Local in-browser store for offline fallback
let localReservations = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');

export const api = {
  // 1. Restaurants Discovery
  async getRestaurants(params = {}) {
    try {
      const res = await apiClient.get('/restaurants', { params });
      return res.data;
    } catch (err) {
      console.warn('Backend API fallback: querying client-side mock store', err.message);
      let results = [...INITIAL_RESTAURANTS];

      if (params.division && params.division !== 'All') {
        results = results.filter(
          (r) => r.division.toLowerCase() === params.division.toLowerCase()
        );
      }
      if (params.subDistrict && params.subDistrict !== 'All') {
        results = results.filter((r) =>
          r.subDistrict.toLowerCase().includes(params.subDistrict.toLowerCase())
        );
      }
      if (params.cuisine && params.cuisine !== 'All Cuisines') {
        results = results.filter((r) =>
          r.cuisineTypes.some((c) =>
            c.toLowerCase().includes(params.cuisine.toLowerCase())
          )
        );
      }
      if (params.price && params.price !== 'All') {
        results = results.filter((r) => r.priceCategory === params.price);
      }
      if (params.search && params.search.trim()) {
        const s = params.search.toLowerCase().trim();
        results = results.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.subDistrict.toLowerCase().includes(s) ||
            r.cuisineTypes.some((c) => c.toLowerCase().includes(s))
        );
      }

      return { success: true, count: results.length, data: results };
    }
  },

  async getRestaurantById(id) {
    try {
      const res = await apiClient.get(`/restaurants/${id}`);
      return res.data;
    } catch (err) {
      const found = INITIAL_RESTAURANTS.find((r) => r._id === id || r.id === id);
      return { success: !!found, data: found };
    }
  },

  async getDivisionStats() {
    try {
      const res = await apiClient.get('/restaurants/meta/division-stats');
      return res.data;
    } catch (err) {
      const stats = {};
      BANGLADESH_DIVISIONS.forEach((d) => {
        stats[d] = INITIAL_RESTAURANTS.filter((r) => r.division === d).length;
      });
      return { success: true, data: stats, totalCount: INITIAL_RESTAURANTS.length };
    }
  },

  // 2. Real-time Reservations
  async createReservation(payload) {
    try {
      const res = await apiClient.post('/reservations', payload);
      return res.data;
    } catch (err) {
      console.warn('Backend API fallback: generating client-side confirmed booking');
      const divCode = payload.division ? payload.division.substring(0, 3).toUpperCase() : 'DHK';
      const code = `TT-${divCode}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking = {
        _id: 'resv_local_' + Date.now(),
        reservationCode: code,
        ...payload,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      localReservations.unshift(newBooking);
      localStorage.setItem('tableturn_local_bookings', JSON.stringify(localReservations));

      return {
        success: true,
        message: 'Table reservation successfully confirmed!',
        data: newBooking,
      };
    }
  },

  async getMyReservations(params = {}) {
    try {
      const token = localStorage.getItem('tableturn_token');
      if (!token) {
        const localBookings = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');
        return { success: true, count: localBookings.length, data: localBookings };
      }
      const res = await apiClient.get('/reservations/my', { params });
      return res.data;
    } catch (err) {
      const currentBookings = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');
      return { success: true, count: currentBookings.length, data: currentBookings };
    }
  },

  async lookupReservation(code) {
    try {
      const clean = encodeURIComponent(code.trim().toUpperCase());
      const res = await apiClient.get(`/reservations/lookup/${clean}`);
      return res.data;
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('tableturn_local_bookings') || '[]');
      const cleanCode = code.trim().toUpperCase();
      const found = local.find(
        (b) => (b.reservationCode && b.reservationCode.toUpperCase() === cleanCode) || b._id === cleanCode
      );
      if (found) {
        return { success: true, data: found };
      }
      throw err.response ? err.response.data : new Error('Reservation lookup failed');
    }
  },

  async checkinReservation(id) {
    try {
      const res = await apiClient.patch(`/reservations/${encodeURIComponent(id)}/checkin`);
      return res.data;
    } catch (err) {
      localReservations = localReservations.map((b) =>
        b._id === id || b.reservationCode === id ? { ...b, status: 'seated' } : b
      );
      localStorage.setItem('tableturn_local_bookings', JSON.stringify(localReservations));
      return { success: true, message: 'Guest marked as seated locally' };
    }
  },

  async cancelReservation(id) {
    try {
      const res = await apiClient.patch(`/reservations/${id}/cancel`);
      return res.data;
    } catch (err) {
      localReservations = localReservations.map((b) =>
        b._id === id || b.reservationCode === id ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('tableturn_local_bookings', JSON.stringify(localReservations));
      return { success: true, message: 'Reservation cancelled successfully' };
    }
  },


  // 3. Auth
  async login(credentials) {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Login failed');
    }
  },

  async register(data) {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Registration failed');
    }
  },

  async demoLogin(role = 'user') {
    try {
      const res = await apiClient.post('/auth/demo', { role });
      return res.data;
    } catch (err) {
      // Local demo session
      return {
        success: true,
        user: {
          id: 'demo_usr_01',
          name: role === 'manager' ? 'Gulshan Venue Manager' : 'Tanvir Hossain (Dhaka)',
          email: `${role}@tableturn.bd`,
          phone: '+8801711223344',
          role: role,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        token: 'demo_jwt_token_2026',
      };
    }
  },
};
