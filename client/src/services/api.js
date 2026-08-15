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

  // 4. Admin & Manager Management
  async getAdminReservations(params = {}) {
    try {
      const res = await apiClient.get('/admin/reservations', { params });
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to load admin reservations');
    }
  },

  async getAdminStats() {
    try {
      const res = await apiClient.get('/admin/stats');
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to load platform statistics');
    }
  },

  async updateAdminReservationStatus(id, status) {
    try {
      const res = await apiClient.patch(`/admin/reservations/${encodeURIComponent(id)}/status`, { status });
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to update reservation status');
    }
  },

  async createRestaurant(payload) {
    try {
      const res = await apiClient.post('/admin/restaurants', payload);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to create restaurant');
    }
  },

  async updateRestaurant(id, payload) {
    try {
      const res = await apiClient.put(`/admin/restaurants/${encodeURIComponent(id)}`, payload);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to update restaurant');
    }
  },

  async deleteRestaurant(id) {
    try {
      const res = await apiClient.delete(`/admin/restaurants/${encodeURIComponent(id)}`);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to delete restaurant');
    }
  },

  async toggleRestaurantOffer(id, offerData) {
    try {
      const res = await apiClient.patch(`/admin/restaurants/${encodeURIComponent(id)}/offer`, offerData);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to update restaurant offer');
    }
  },

  // 5. Customer Reviews & Ratings
  async addReview(restaurantId, reviewData) {
    try {
      const res = await apiClient.post(`/restaurants/${encodeURIComponent(restaurantId)}/reviews`, reviewData);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to post review');
    }
  },

  async getRestaurantReviews(restaurantId) {
    try {
      const res = await apiClient.get(`/restaurants/${encodeURIComponent(restaurantId)}/reviews`);
      return res.data;
    } catch (err) {
      return { success: true, data: [] };
    }
  },

  // 6. User Profile & Favorites
  async toggleFavorite(restaurantId) {
    try {
      const res = await apiClient.post(`/auth/favorites/${encodeURIComponent(restaurantId)}`);
      return res.data;
    } catch (err) {
      // Local fallback
      let favs = JSON.parse(localStorage.getItem('tableturn_favs') || '[]');
      let isFav = false;
      if (favs.includes(restaurantId)) {
        favs = favs.filter((f) => f !== restaurantId);
        isFav = false;
      } else {
        favs.push(restaurantId);
        isFav = true;
      }
      localStorage.setItem('tableturn_favs', JSON.stringify(favs));
      return { success: true, isFavorited: isFav, favorites: favs };
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await apiClient.put('/auth/profile', profileData);
      return res.data;
    } catch (err) {
      throw err.response ? err.response.data : new Error('Failed to update profile');
    }
  },
};


