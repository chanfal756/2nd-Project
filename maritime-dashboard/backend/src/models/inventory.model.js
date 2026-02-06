const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
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
    itemType: {
      type: String,
      enum: ['HFO', 'MGO', 'Lube Oil', 'Cylinder Oil', 'Spare Part', 'Provision'],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    currentQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      default: 'MT', // Metric Tons
    },
    capacity: {
      type: Number,
    },
    minSafetyLevel: {
      type: Number,
      default: 10,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup per vessel/org
inventorySchema.index({ vesselId: 1, itemType: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
