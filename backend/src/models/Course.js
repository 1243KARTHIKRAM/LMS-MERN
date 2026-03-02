const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  resources: [
    {
      title: String,
      url: String,
      type: String
    }
  ]
});

// Video schema for course sections
const sectionVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a video title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL']
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  thumbnail: {
    type: String
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  }
});

// Section schema for course content
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a section title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  videos: [sectionVideoSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description']
    },
    thumbnail: {
      type: String
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category']
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    price: {
      type: Number,
      default: 0
    },
    lessons: [lessonSchema],
    sections: [sectionSchema],
    totalDuration: {
      type: Number,
      default: 0
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isPublished: {
      type: Boolean,
      default: false
    },
    tags: [String],
    requirements: [String],
    outcomes: [String]
  },
  {
    timestamps: true
  }
);

// Calculate total duration before saving
courseSchema.pre('save', function (next) {
  const lessonsDuration = this.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
  const sectionsDuration = this.sections.reduce((acc, section) => {
    const sectionVideosDuration = section.videos.reduce((vAcc, video) => vAcc + (video.duration || 0), 0);
    return acc + sectionVideosDuration;
  }, 0);
  this.totalDuration = lessonsDuration + sectionsDuration;
  next();
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
