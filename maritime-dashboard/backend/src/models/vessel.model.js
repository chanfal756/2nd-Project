const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vessel name is required'],
      trim: true,
    },
    imo: {
      type: String,
      required: [true, 'IMO number is required'],
      unique: true,
      trim: true,
      match: [/^\d{7}$/, 'IMO must be exactly 7 digits'],
    },
    mmsi: {
      type: String,
      trim: true,
      match: [/^\d{9}$/, 'MMSI must be exactly 9 digits'],
    },
    callSign: {
      type: String,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: [true, 'Vessel type is required'],
      enum: [
        'Tanker',
        'Container',
        'Bulk Carrier',
        'General Cargo',
        'Passenger',
        'Tug',
        'Fishing',
        'Offshore Support',
        'Other',
      ],
    },
    flag: {
      type: String,
      required: [true, 'Flag/Nationality is required'],
    },
    grossTonnage: {
      type: Number,
    },
    yearBuilt: {
      type: Number,
      min: [1900, 'Year built cannot be before 1900'],
      max: [new Date().getFullYear(), 'Year built cannot be in the future'],
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Decommissioned', 'Under Construction'],
      default: 'Active',
    },
    owner: {
      type: String,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
      index: true,
    },
    lastPosition: {
      lat: Number,
      lon: Number,
      speed: Number,
      heading: Number,
      timestamp: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search
vesselSchema.index({ name: 'text', imo: 'text', callSign: 'text' });

const Vessel = mongoose.model('Vessel', vesselSchema);

module.exports = Vessel;
