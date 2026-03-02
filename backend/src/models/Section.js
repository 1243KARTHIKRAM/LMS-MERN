const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a section title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Please provide a subject']
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

// Index for efficient querying by subject and ordering
sectionSchema.index({ subject: 1, orderIndex: 1 });

module.exports = mongoose.model('Section', sectionSchema);
