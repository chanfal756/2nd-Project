const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: true,
      enum: ['Noon Report', 'Arrival Report', 'Departure Report', 'Oil Record Book'],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vesselName: {
      type: String,
      required: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed', 'approved'],
      default: 'submitted',
    },
    referenceNumber: {
      type: String,
      unique: true,
    },
    // Generic details field for different report types
    details: {
      // For Noon Report
      position: String,
      course: String,
      speed: String,
      weather: String,
      fuelConsumption: String,
      distanceToGo: String,
      
      // For Arrival/Departure
      port: String,
      berth: String,
      draft: {
        forward: String,
        aft: String,
      },
      eta: Date,
      etd: Date,
      
      // For Oil Record Book
      operation: String,
      tankName: String,
      quantity: String,
      remark: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique reference number before saving
reportSchema.pre('save', async function (next) {
  if (!this.referenceNumber) {
    const prefix = this.reportType.substring(0, 3).toUpperCase();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.referenceNumber = `${prefix}-${dateStr}-${random}`;
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
