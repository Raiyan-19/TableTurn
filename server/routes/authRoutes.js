const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  toggleFavorite,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/favorites/:restaurantId', protect, toggleFavorite);
router.put('/profile', protect, updateProfile);

module.exports = router;


