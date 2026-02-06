const express = require('express');
const router = express.Router();

// Import versioned sub-routes
const vesselRoutes = require('./vessel.routes');
const mapRoutes = require('./map.routes');
const { getSystemHealth, getTenantMetrics } = require('../../controllers/health.controller');
const tenantMiddleware = require('../../middlewares/tenant.middleware');
const { protect } = require('../../middlewares/auth.middleware');

// Public Health Check (Internal usage / Load balancer)
router.get('/health', getSystemHealth);

// Metrics (Admin/Tenant only)
router.get('/metrics', protect, tenantMiddleware, getTenantMetrics);

// Module Routes
router.use('/vessels', vesselRoutes);
router.use('/map', mapRoutes);

module.exports = router;
