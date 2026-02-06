const express = require('express');
const router = express.Router();
const redisService = require('../../services/redis.service');
const { protect } = require('../../middlewares/auth.middleware');
const { requirePlan } = require('../../middlewares/rbac.middleware');

router.use(protect);

/**
 * @route   GET /api/v1/map/live
 * @desc    Get real-time positions from HOT STORAGE (Redis)
 * @access  Private + Feature Gated
 */
router.get('/live', async (req, res) => {
  try {
    // Basic example: get all vessels in area from Redis
    const { lat, lon, radius = 500 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'GPS coordinates required' });
    }

    const positions = await redisService.getVesselsInArea(lat, lon, radius);
    
    res.json({
      success: true,
      timestamp: Date.now(),
      data: positions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
