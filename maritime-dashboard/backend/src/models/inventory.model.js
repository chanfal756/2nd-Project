const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    vesselId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hfo: {
      current: { type: Number, default: 0 },
      capacity: { type: Number, default: 600 },
      dailyConsumption: { type: Number, default: 0 },
    },
    mgo: {
      current: { type: Number, default: 0 },
      capacity: { type: Number, default: 120 },
      dailyConsumption: { type: Number, default: 0 },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
