const express = require('express');
const router = express.Router();
const { 
  getFleetAnalytics, 
  getFleetVessels,
  getThresholds,
  createThreshold,
  verifyReport,
  exportCompliance
} = require('../controllers/fleet.controller');
const { protect } = require('../middlewares/auth.middleware');
const tenantMiddleware = require('../middlewares/tenant.middleware');

// Apply protection and tenant context to all fleet routes
router.use(protect);
router.use(tenantMiddleware);

router.get('/analytics', getFleetAnalytics);
router.get('/vessels', getFleetVessels);

router.route('/thresholds')
  .get(getThresholds)
  .post(createThreshold);

router.patch('/verify/:id', verifyReport);
router.get('/export-compliance', exportCompliance);

module.exports = router;
