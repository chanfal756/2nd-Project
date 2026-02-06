const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema(
  {
    vesselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel',
      required: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    component: {
      type: String, // e.g., 'Main Engine', 'Aux Engine 1', 'Purifier'
      required: true,
    },
    type: {
      type: String,
      enum: ['Routine', 'Breakdown', 'Oil Change', 'Inspection', 'Overhaul'],
      default: 'Routine',
    },
    engineHours: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed', 'Postponed'],
      default: 'Completed',
    },
    performedBy: {
      type: String, // Name or ID of crew
    },
    datePerformed: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
    },
    partsUsed: [{
      partName: String,
      quantity: Number,
    }]
  },
  {
    timestamps: true,
  }
);

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);

module.exports = MaintenanceLog;
