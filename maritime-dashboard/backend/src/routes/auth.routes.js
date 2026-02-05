const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

/**
 * Authentication Routes
 * Base URL: /api/auth
 */

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

module.exports = router;
