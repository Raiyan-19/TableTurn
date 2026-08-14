const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory fallback users for instant testing
let memoryUsers = [
  {
    _id: 'usr_bd_001',
    name: 'Tanvir Hossain',
    email: 'tanvir@tableturn.bd',
    phone: '+8801711223344',
    passwordHash: bcrypt.hashSync('tanvir123', 8),
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    favorites: [],
  },
  {
    _id: 'usr_mgr_002',
    name: 'Shakila Jahan (Gulshan Grove Manager)',
    email: 'manager@thegrove.bd',
    phone: '+8801819887766',
    passwordHash: bcrypt.hashSync('Shakila1122', 8),
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    favorites: [],
  },
  {
    _id: 'usr_adm_003',
    name: 'System Admin Bangladesh',
    email: 'admin@tableturn.bd',
    phone: '+8801912345678',
    passwordHash: bcrypt.hashSync('admin1122', 8),
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    favorites: [],
  }
];

const generateToken = (id, role, name, email, phone) => {
  return jwt.sign({ id, role, name, email, phone }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // BD Phone validation regex
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Bangladeshi phone number. Format should be +88017XXXXXXXX or 017XXXXXXXX',
      });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password,
        role: role || 'user',
      });

      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        token: generateToken(user._id, user.role, user.name, user.email, user.phone),
      });
    } else {
      const exists = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        phone,
        passwordHash: bcrypt.hashSync(password, 8),
        role: role || 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        favorites: [],
      };

      memoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          avatar: newUser.avatar,
        },
        token: generateToken(newUser._id, newUser.role, newUser.name, newUser.email, newUser.phone),
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        token: generateToken(user._id, user.role, user.name, user.email, user.phone),
      });
    } else {
      const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        token: generateToken(user._id, user.role, user.name, user.email, user.phone),
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Quick demo login helper for seamless testing
// @route   POST /api/auth/demo
const demoLogin = async (req, res) => {
  try {
    const { role = 'user' } = req.body;
    let target = memoryUsers.find((u) => u.role === role) || memoryUsers[0];

    return res.json({
      success: true,
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        phone: target.phone,
        role: target.role,
        avatar: target.avatar,
      },
      token: generateToken(target._id, target.role, target.name, target.email, target.phone),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    if (getDBStatus()) {
      const user = await User.findById(userId).populate('favorites');
      return res.json({ success: true, user });
    } else {
      const user = memoryUsers.find((u) => u._id === userId);
      return res.json({ success: true, user: user || req.user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  demoLogin,
  getMe,
  memoryUsers,
};
