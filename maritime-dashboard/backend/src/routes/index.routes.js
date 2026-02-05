const express = require('express');
const router = express.Router();

/**
 * API Index Route
 * Base URL: /api
 */

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Maritime Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
        update: 'PUT /api/auth/update (protected)',
      },
    },
  });
});

module.exports = router;
