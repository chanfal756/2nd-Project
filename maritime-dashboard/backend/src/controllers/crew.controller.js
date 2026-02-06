const Crew = require('../models/crew.model');

// @desc    Register a new crew member
// @route   POST /api/crew
// @access  Private
exports.registerCrew = async (req, res) => {
  try {
    const Organization = require('../models/organization.model');
    let orgId = req.user.orgId;
    if (!orgId) {
      const defaultOrg = await Organization.findOne({ slug: 'default' });
      orgId = defaultOrg ? defaultOrg._id : null;
    }

    const crewMember = await Crew.create({
      ...req.body,
      addedBy: req.user.id,
      orgId: orgId,
    });

    res.status(201).json({
      success: true,
      data: crewMember,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all crew members
// @route   GET /api/crew
// @access  Private
exports.getCrew = async (req, res) => {
  try {
    const { vesselId, rank, status } = req.query;
    const query = req.user.orgId ? { orgId: req.user.orgId } : {};

    if (vesselId) query.vessel = vesselId;
    if (rank) query.rank = rank;
    if (status) query.status = status;

    const crew = await Crew.find(query)
      .populate('vessel', 'name')
      .populate('addedBy', 'name email')
      .sort({ lastName: 1 });

    res.status(200).json({
      success: true,
      count: crew.length,
      data: crew,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single crew member
// @route   GET /api/crew/:id
// @access  Private
exports.getCrewMember = async (req, res) => {
  try {
    const crewMember = await Crew.findById(req.params.id)
      .populate('vessel', 'name')
      .populate('addedBy', 'name email');

    if (!crewMember) {
      return res.status(404).json({
        success: false,
        message: 'Crew member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: crewMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update crew member
// @route   PUT /api/crew/:id
// @access  Private
exports.updateCrewMember = async (req, res) => {
  try {
    const crewMember = await Crew.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!crewMember) {
      return res.status(404).json({
        success: false,
        message: 'Crew member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: crewMember,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete crew member
// @route   DELETE /api/crew/:id
// @access  Private/Admin
exports.deleteCrewMember = async (req, res) => {
  try {
    const crewMember = await Crew.findById(req.params.id);

    if (!crewMember) {
      return res.status(404).json({
        success: false,
        message: 'Crew member not found',
      });
    }

    await crewMember.deleteOne();

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
