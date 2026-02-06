const Inventory = require('../models/inventory.model');
const Vessel = require('../models/vessel.model');
const Organization = require('../models/organization.model');

// Helper to get OrgId with SaaS fallback
const getOrgId = async (user) => {
  if (user.orgId) return user.orgId;
  const defaultOrg = await Organization.findOne({ slug: 'default' });
  return defaultOrg ? defaultOrg._id : null;
};

/**
 * @desc    Get inventory for current vessel
 * @route   GET /api/inventory
 * @access  Private
 */
const getInventory = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    
    // Find the first vessel for this org if none specified
    let vessel = await Vessel.findOne({ orgId });
    if (!vessel) {
      // Create a dummy vessel if none exist yet to prevent total failure
      vessel = await Vessel.create({
        name: 'MV Ocean Star',
        imo: '9999999',
        type: 'General Cargo',
        flag: 'Marshall Islands',
        orgId
      });
    }

    const vesselId = vessel._id;
    
    // Check if items exist
    let items = await Inventory.find({ vesselId, orgId });

    // Auto-setup if empty
    if (items.length === 0) {
      const defaultItems = [
        { itemType: 'HFO', itemName: 'Heavy Fuel Oil', currentQuantity: 450.5, capacity: 600, unit: 'MT', vesselId, orgId },
        { itemType: 'MGO', itemName: 'Marine Gas Oil', currentQuantity: 85.2, capacity: 120, unit: 'MT', vesselId, orgId }
      ];
      items = await Inventory.insertMany(defaultItems);
    }

    // Transform for frontend legacy support
    const hfo = items.find(i => i.itemType === 'HFO') || { currentQuantity: 0, capacity: 600 };
    const mgo = items.find(i => i.itemType === 'MGO') || { currentQuantity: 0, capacity: 120 };

    res.status(200).json({
      success: true,
      data: {
        lastUpdated: new Date(),
        hfo: {
          current: hfo.currentQuantity,
          capacity: hfo.capacity || 600,
          dailyConsumption: 12.2 // Mock for now
        },
        mgo: {
          current: mgo.currentQuantity,
          capacity: mgo.capacity || 120,
          dailyConsumption: 2.5 // Mock for now
        }
      },
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
 * @desc    Update inventory levels
 * @route   PUT /api/inventory/update
 * @access  Private
 */
const updateInventory = async (req, res) => {
  try {
    const { hfo, mgo } = req.body;
    const orgId = await getOrgId(req.user);
    const vessel = await Vessel.findOne({ orgId });
    
    if (!vessel) return res.status(404).json({ success: false, message: 'Vessel not found' });

    if (hfo && hfo.current !== undefined) {
      await Inventory.findOneAndUpdate(
        { vesselId: vessel._id, itemType: 'HFO', orgId },
        { currentQuantity: hfo.current },
        { upsert: true }
      );
    }

    if (mgo && mgo.current !== undefined) {
      await Inventory.findOneAndUpdate(
        { vesselId: vessel._id, itemType: 'MGO', orgId },
        { currentQuantity: mgo.current },
        { upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully'
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
