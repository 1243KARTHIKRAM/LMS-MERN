const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Please provide a subject']
    }
  },
  {
    timestamps: true
  }
);

// Unique compound index on (user, subject)
enrollmentSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
