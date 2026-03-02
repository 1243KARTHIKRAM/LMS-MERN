const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user']
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: [true, 'Please provide a video']
    },
    watchedTime: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Unique compound index on (user, video)
videoProgressSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
