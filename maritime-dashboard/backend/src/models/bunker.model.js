const mongoose = require('mongoose');

const bunkerRecordSchema = new mongoose.Schema(
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
    port: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['HFO', 'MGO', 'LSMGO', 'VLSFO'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'MT',
    },
    bunkerDate: {
      type: Date,
      default: Date.now,
    },
    supplier: {
      type: String,
    },
    bdnNumber: {
      type: String, // Bunker Delivery Note number
      required: true,
    },
    viscosity: Number,
    density: Number,
    sulphurContent: Number,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

const BunkerRecord = mongoose.model('BunkerRecord', bunkerRecordSchema);

module.exports = BunkerRecord;
