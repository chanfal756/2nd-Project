const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    vesselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel',
      required: false, // null means global for the organization
    },
    parameter: {
      type: String,
      required: true,
      enum: ['fuel_level', 'speed', 'temperature', 'humidity', 'off_course_distance'],
    },
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
    },
    unit: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

const Threshold = mongoose.model('Threshold', thresholdSchema);
module.exports = Threshold;
