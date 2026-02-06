const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },
    settings: {
      mapTheme: { type: String, default: 'standard' },
      retentionDays: { type: Number, default: 30 },
      isAISFeedEnabled: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
