const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    category: {
      type: String,
      enum: ['General', 'Navigation', 'Engineering', 'Safety', 'Security', 'Environmental'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel',
      required: false, // Can be a global alert if no vessel is selected
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    acknowledgedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
