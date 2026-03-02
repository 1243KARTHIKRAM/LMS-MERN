const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a video title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide a video URL'],
      trim: true
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Please provide a section']
    },
    orderIndex: {
      type: Number,
      required: [true, 'Please provide an order index'],
      min: [0, 'Order index must be a positive number']
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying by section and ordering
videoSchema.index({ section: 1, orderIndex: 1 });

module.exports = mongoose.model('Video', videoSchema);
