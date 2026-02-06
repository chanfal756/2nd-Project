const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    rank: {
      type: String,
      required: [true, 'Rank is required'],
      enum: [
        'Captain',
        'Chief Officer',
        'Second Officer',
        'Third Officer',
        'Chief Engineer',
        'Second Engineer',
        'Third Engineer',
        'Bosun',
        'AB Seaman',
        'OS Seaman',
        'Cook',
        'Steward',
        'Cadet',
      ],
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
    },
    passportNumber: {
      type: String,
      required: [true, 'Passport number is required'],
      unique: true,
    },
    seamanBookNumber: {
      type: String,
      required: [true, 'Seaman Book number is required'],
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vessel',
      required: [true, 'Vessel assignment is required'],
    },
    status: {
      type: String,
      enum: ['On Board', 'On Leave', 'Standby', 'Resigned'],
      default: 'On Board',
    },
    contactNumber: String,
    email: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
crewSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

crewSchema.set('toJSON', { virtuals: true });

const Crew = mongoose.model('Crew', crewSchema);

module.exports = Crew;
