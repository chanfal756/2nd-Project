const express = require('express');
const router = express.Router();
const {
  registerVessel,
  getVessels,
  getVessel,
  updateVessel,
  deleteVessel,
} = require('../controllers/vessel.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All vessel routes are protected
router.use(protect);

router
  .route('/')
  .post(registerVessel)
  .get(getVessels);

router
  .route('/:id')
  .get(getVessel)
  .put(updateVessel)
  .delete(authorize('admin'), deleteVessel); // Only admin can delete a vessel

module.exports = router;
