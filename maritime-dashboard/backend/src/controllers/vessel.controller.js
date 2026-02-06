const Vessel = require('../models/vessel.model');

// @desc    Register a new vessel
// @route   POST /api/vessels
// @access  Private
exports.registerVessel = async (req, res) => {
  try {
    const { name, imo, mmsi, callSign, type, flag, grossTonnage, yearBuilt, status, owner } = req.body;

    // Check if vessel with same IMO already exists
    const existingVessel = await Vessel.findOne({ imo });
    if (existingVessel) {
      return res.status(400).json({
        success: false,
        message: `Vessel with IMO ${imo} is already registered`,
      });
    }

    // Production-grade fallback for orgId
    let orgId = req.user.orgId;
    if (!orgId) {
      const Organization = require('../models/organization.model');
      const defaultOrg = await Organization.findOne({ slug: 'default' });
      orgId = defaultOrg ? defaultOrg._id : null;
    }

    const vessel = await Vessel.create({
      name,
      imo,
      mmsi,
      callSign,
      type,
      flag,
      grossTonnage,
      yearBuilt,
      status,
      owner,
      addedBy: req.user.id,
      orgId: orgId,
    });

    res.status(201).json({
      success: true,
      data: vessel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all vessels
// @route   GET /api/vessels
// @access  Private
exports.getVessels = async (req, res) => {
  try {
    const query = req.user.orgId ? { orgId: req.user.orgId } : {};
    const vessels = await Vessel.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vessels.length,
      data: vessels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single vessel details
// @route   GET /api/vessels/:id
// @access  Private
exports.getVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id).populate('addedBy', 'name email');

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: vessel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update vessel info
// @route   PUT /api/vessels/:id
// @access  Private
exports.updateVessel = async (req, res) => {
  try {
    let vessel = await Vessel.findById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found',
      });
    }

    vessel = await Vessel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: vessel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Deregister/Delete vessel
// @route   DELETE /api/vessels/:id
// @access  Private/Admin
exports.deleteVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found',
      });
    }

    await vessel.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
