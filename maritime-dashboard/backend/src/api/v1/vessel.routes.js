const express = require('express');
const router = express.Router();
const vesselController = require('../../controllers/vessel.controller'); // Existing controller
const { protect } = require('../../middlewares/auth.middleware');
const tenantMiddleware = require('../../middlewares/tenant.middleware');
const { checkPermission = (p) => (req, res, next) => next() } = require('../../middlewares/rbac.middleware');

// Apply Global SaaS Security Stack
router.use(protect);
router.use(tenantMiddleware);

/**
 * @route   GET /api/v1/vessels
 * @desc    Get all vessels for the current tenant
 * @access  Private (Tenant Isolated)
 */
router.get('/', vesselController.getVessels);

/**
 * @route   POST /api/v1/vessels
 * @desc    Register a new vessel (Requires fleet_manage permission)
 */
router.post('/', checkPermission('fleet_manage'), vesselController.registerVessel);

module.exports = router;
