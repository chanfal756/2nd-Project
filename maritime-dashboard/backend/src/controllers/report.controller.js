const Report = require('../models/report.model');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { reportType, vesselName, details, reportDate } = req.body;

    const report = await Report.create({
      reportType,
      vesselName,
      details,
      reportDate: reportDate || Date.now(),
      reportedBy: req.user.id, // Set by auth middleware
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all reports (can filter by type)
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { type, vessel } = req.query;
    const query = {};

    if (type) query.reportType = type;
    if (vessel) query.vesselName = new RegExp(vessel, 'i');

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 }); // Newest first for easy viewing

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reportedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check if user is the one who reported or an admin
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this report',
      });
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Check if user is the one who reported or an admin
    if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this report',
      });
    }

    await report.deleteOne();

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
