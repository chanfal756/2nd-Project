const mongoose = require('mongoose');
const DailyFuelReport = require('../models/fuelReport.model');
const MaintenanceLog = require('../models/maintenance.model');
const BunkerRecord = require('../models/bunker.model');
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
 * FUEL & OIL REPORTING
 */
exports.createFuelReport = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    const report = await DailyFuelReport.create({
      ...req.body,
      orgId,
      submittedBy: req.user.id
    });

    // Automatically update Inventory ROB levels
    const checkSafetyLevels = async (vId, type, qty, orgId) => {
      const inv = await Inventory.findOneAndUpdate(
        { vesselId: vId, itemType: type, orgId },
        { currentQuantity: qty, lastUpdatedBy: req.user.id, itemName: type === 'HFO' ? 'Heavy Fuel Oil' : 'Marine Gas Oil' },
        { upsert: true, new: true }
      );

      if (inv.currentQuantity < (inv.minSafetyLevel || 20)) {
        const Alert = require('../models/alert.model');
        await Alert.create({
          title: `LOW ${type} LEVEL: ${inv.vesselId?.name || 'Vessel'}`,
          message: `Current ${type} level is ${qty}MT, which is below the safety threshold. Consider bunkering soon.`,
          category: 'Engineering',
          priority: 'high',
          vessel: vId,
          orgId: orgId,
          createdBy: req.user.id
        });
      }
    };

    await checkSafetyLevels(req.body.vesselId, 'HFO', req.body.rob_hfo, orgId);
    await checkSafetyLevels(req.body.vesselId, 'MGO', req.body.rob_mgo, orgId);

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getFuelReports = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    const query = { orgId };
    if (req.query.vesselId) query.vesselId = req.query.vesselId;
    
    const reports = await DailyFuelReport.find(query)
      .populate('vesselId', 'name')
      .sort({ date: -1 });
      
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * BUNKERING & REFUELING
 */
exports.createBunkerRecord = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    const record = await BunkerRecord.create({
      ...req.body,
      orgId
    });

    // Update Inventory - Add bunkered quantity
    const inv = await Inventory.findOne({ vesselId: req.body.vesselId, itemType: req.body.fuelType, orgId });
    if (inv) {
      inv.currentQuantity += Number(req.body.quantity);
      await inv.save();
    }

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * MAINTENANCE & OIL CHANGE
 */
exports.createMaintenanceLog = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    const log = await MaintenanceLog.create({
      ...req.body,
      orgId
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMaintenanceLogs = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    const query = { orgId };
    if (req.query.vesselId) query.vesselId = req.query.vesselId;
    
    const logs = await MaintenanceLog.find(query)
      .populate('vesselId', 'name')
      .sort({ datePerformed: -1 });
      
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * FLEET MONITORING (Aggregation)
 */
exports.getFleetAnalytics = async (req, res) => {
  try {
    const orgId = await getOrgId(req.user);
    
    // Total fuel consumed in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const stats = await DailyFuelReport.aggregate([
      { $match: { orgId: mongoose.Types.ObjectId(orgId), date: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: null,
        totalHFO: { $sum: "$consumption_hfo" },
        totalMGO: { $sum: "$consumption_mgo" },
        avgSpeed: { $avg: "$average_speed" }
      }}
    ]);

    res.status(200).json({ success: true, data: stats[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
