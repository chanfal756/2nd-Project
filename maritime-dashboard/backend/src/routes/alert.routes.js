const express = require('express');
const router = express.Router();
const {
  createAlert,
  getAlerts,
  acknowledgeAlert,
} = require('../controllers/alert.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.route('/')
  .post(createAlert)
  .get(getAlerts);

router.put('/:id/acknowledge', acknowledgeAlert);

module.exports = router;
