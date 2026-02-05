const Inventory = require('../models/inventory.model');

/**
 * @desc    Get inventory for current vessel
 * @route   GET /api/inventory
 * @access  Private
 */
const getInventory = async (req, res) => {
  try {
    // Ensure user exists
    if (!req.user || !req.user._id) {
      console.error('❌ User ID missing in request');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const vesselId = req.user._id;
    console.log(`🔍 Fetching inventory for Vessel ID: ${vesselId}`);
    
    let inventory = await Inventory.findOne({ vesselId });

    // Create default inventory if not exists
    if (!inventory) {
      console.log('📝 No inventory found, creating default data...');
      try {
        inventory = await Inventory.create({
          vesselId,
          hfo: { current: 450.5, capacity: 600, dailyConsumption: 12.2 },
          mgo: { current: 85.2, capacity: 120, dailyConsumption: 2.5 }
        });
        console.log('✅ Default inventory created successfully');
      } catch (createError) {
        console.error('❌ Failed to create default inventory:', createError);
        throw new Error('Failed to initialize vessel inventory: ' + createError.message);
      }
    }

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('❌ Inventory fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory data: ' + error.message,
    });
  }
};

/**
 * @desc    Update inventory levels (e.g. after bunkering)
 * @route   PUT /api/inventory/update
 * @access  Private
 */
const updateInventory = async (req, res) => {
  try {
    const { hfo, mgo } = req.body;
    
    let inventory = await Inventory.findOne({ vesselId: req.user.id });

    if (!inventory) {
      inventory = new Inventory({ vesselId: req.user.id });
    }

    if (hfo) inventory.hfo = { ...inventory.hfo, ...hfo };
    if (mgo) inventory.mgo = { ...inventory.mgo, ...mgo };
    
    inventory.lastUpdated = Date.now();
    await inventory.save();

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating inventory',
    });
  }
};

module.exports = {
  getInventory,
  updateInventory,
};
