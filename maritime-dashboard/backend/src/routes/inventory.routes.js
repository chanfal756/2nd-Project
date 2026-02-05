const express = require('express');
const router = express.Router();
const { getInventory, updateInventory } = require('../controllers/inventory.controller');
const { protect } = require('../middlewares/auth.middleware');

// All inventory routes are protected
router.use(protect);

router.get('/', getInventory);
router.put('/update', updateInventory);

module.exports = router;
