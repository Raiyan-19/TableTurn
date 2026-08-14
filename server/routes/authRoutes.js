const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  demoLogin,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo', demoLogin);
router.get('/me', protect, getMe);

module.exports = router;
