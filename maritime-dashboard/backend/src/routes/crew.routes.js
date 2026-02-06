const express = require('express');
const router = express.Router();
const {
  registerCrew,
  getCrew,
  getCrewMember,
  updateCrewMember,
  deleteCrewMember,
} = require('../controllers/crew.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);

router.route('/')
  .post(registerCrew)
  .get(getCrew);

router.route('/:id')
  .get(getCrewMember)
  .put(updateCrewMember)
  .delete(authorize('admin'), deleteCrewMember);

module.exports = router;
