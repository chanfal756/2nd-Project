const mongoose = require('mongoose');

const dailyFuelReportSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // ROB (Remaining On Board)
    rob_hfo: { type: Number, required: true },
    rob_mgo: { type: Number, required: true },
    rob_lube_oil: { type: Number },
    
    // Consumption in last 24h
    consumption_hfo: { type: Number, required: true },
    consumption_mgo: { type: Number, required: true },
    
    // Engine Hours
    me_hours: Number,
    ae_hours: Number,
    
    // Position/Distance
    distance_observed: Number,
    distance_engine: Number,
    average_speed: Number,
    
    weather_condition: String,
    remarks: String,
    
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reports for same vessel on same day
dailyFuelReportSchema.index({ vesselId: 1, date: 1 }, { unique: true });

const DailyFuelReport = mongoose.model('DailyFuelReport', dailyFuelReportSchema);

module.exports = DailyFuelReport;
