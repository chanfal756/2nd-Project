const mongoose = require('mongoose');
const Vessel = require('../models/vessel.model');
const Report = require('../models/report.model');
const Alert = require('../models/alert.model');
const Threshold = require('../models/threshold.model');

/**
 * @desc    Get fleet-wide analytics
 * @route   GET /api/fleet/analytics
 * @access  Private/Admin
 */
exports.getFleetAnalytics = async (req, res) => {
  try {
    const orgId = req.user.orgId;

    if (!orgId) {
      return res.status(403).json({ success: false, message: 'No organization context found' });
    }

    // 1. Vessel Status Breakdown
    const vesselStats = await Vessel.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 2. Recent Reports Summary (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reportStats = await Report.aggregate([
      { 
        $match: { 
          orgId: new mongoose.Types.ObjectId(orgId),
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Fuel Consumption Trend (Mocked or calculated from fuel reports)
    // For now, let's just return a summary of reported fuel from Noon reports
    const fuelConsumption = await Report.aggregate([
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
          reportType: 'Noon Report',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalFuel: { $sum: { $toDouble: { $ifNull: ["$details.fuelConsumption", 0] } } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        vessels: vesselStats,
        reports: reportStats,
        fuelTrend: fuelConsumption
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all vessels with detailed summary
 * @route   GET /api/fleet/vessels
 * @access  Private
 */
exports.getFleetVessels = async (req, res) => {
  try {
    const vessels = await Vessel.find({ orgId: req.user.orgId })
      .select('name imo status lastPosition type')
      .sort('name');

    res.status(200).json({
      success: true,
      count: vessels.length,
      data: vessels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get/Manage Thresholds
 * @route   GET /api/fleet/thresholds
 */
exports.getThresholds = async (req, res) => {
  try {
    const thresholds = await Threshold.find({ orgId: req.user.orgId });
    res.status(200).json({ success: true, data: thresholds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createThreshold = async (req, res) => {
  try {
    const threshold = await Threshold.create({
      ...req.body,
      orgId: req.user.orgId,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: threshold });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyReport = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user.orgId },
      { status, 'details.remark': remarks },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportCompliance = async (req, res) => {
  try {
    const reports = await Report.find({ 
      orgId: req.user.orgId,
      status: 'approved' 
    }).populate('reportedBy', 'name');

    res.status(200).json({
      success: true,
      data: reports,
      message: 'Compliance data prepared for download'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
