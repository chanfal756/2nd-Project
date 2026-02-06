const Alert = require('../models/alert.model');
const Vessel = require('../models/vessel.model');

// @desc    Create a new alert/broadcast
// @route   POST /api/alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    const { title, message, category, priority, vesselId } = req.body;

    // SaaS Fallback for orgId
    let orgId = req.user.orgId;
    if (!orgId) {
      const Organization = require('../models/organization.model');
      const defaultOrg = await Organization.findOne({ slug: 'default' });
      if (defaultOrg) {
        orgId = defaultOrg._id;
      } else {
        // Emergency fallback: Create default org if totally missing
        const newOrg = await Organization.create({
          name: 'Default Organization',
          slug: 'default',
          plan: 'enterprise'
        });
        orgId = newOrg._id;
      }
    }

    let alert = await Alert.create({
      title,
      message,
      category,
      priority: priority || 'normal',
      vessel: (vesselId && vesselId !== 'null' && vesselId !== '') ? vesselId : null,
      orgId: orgId,
      createdBy: req.user._id || req.user.id,
    });

    // Populate for the frontend response
    alert = await alert.populate('vessel', 'name');
    alert = await alert.populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error('❌ Alert Creation Failed:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all alerts for organization/tenant
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const { vesselId, priority, category } = req.query;
    
    // SaaS Fallback for orgId
    let orgId = req.user.orgId;
    if (!orgId) {
      const Organization = require('../models/organization.model');
      const defaultOrg = await Organization.findOne({ slug: 'default' });
      orgId = defaultOrg ? defaultOrg._id : null;
    }

    const query = orgId ? { orgId } : {};

    if (vesselId && vesselId !== 'null' && vesselId !== '') query.vessel = vesselId;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const alerts = await Alert.find(query)
      .populate('vessel', 'name')
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Acknowledge an alert
// @route   PUT /api/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    if (!alert.acknowledgedBy.includes(req.user.id)) {
      alert.acknowledgedBy.push(req.user.id);
      await alert.save();
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
