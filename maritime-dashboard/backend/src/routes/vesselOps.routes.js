const express = require('express');
const router = express.Router();
const {
  createFuelReport,
  getFuelReports,
  createBunkerRecord,
  createMaintenanceLog,
  getMaintenanceLogs,
  getFleetAnalytics
} = require('../controllers/vesselOps.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

// Fuel & Oil Reporting
router.route('/fuel-reports')
  .post(createFuelReport)
  .get(getFuelReports);

// Bunkering
router.post('/bunker-records', createBunkerRecord);

// Maintenance
router.route('/maintenance')
  .post(createMaintenanceLog)
  .get(getMaintenanceLogs);

// Fleet Analytics
router.get('/analytics', getFleetAnalytics);

module.exports = router;
