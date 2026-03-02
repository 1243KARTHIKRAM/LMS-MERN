const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a subject title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      trim: true
    },
    thumbnail: {
      type: String
    },
    category: {
      type: String,
      required: [true, 'Please provide a category']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for sections
subjectSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'subject'
});

// Index for search
subjectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Subject', subjectSchema);
