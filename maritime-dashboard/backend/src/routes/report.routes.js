const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
} = require('../controllers/report.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All routes are protected
router.use(protect);

router
  .route('/')
  .post(createReport)
  .get(getReports);

router
  .route('/:id')
  .get(getReport)
  .put(updateReport)
  .delete(deleteReport);

module.exports = router;
