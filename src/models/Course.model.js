const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    level: {
      type: String,
      required: [true, 'Course level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Level must be beginner, intermediate, or advanced',
      },
    },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
    track: {
      type: String,
      enum: ['nodejs', 'dsa-cpp', 'other'],
      default: 'nodejs',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for filtering courses by level quickly
CourseSchema.index({ level: 1 });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ track: 1, level: 1 });

// Virtual — computed field, not stored in DB
CourseSchema.virtual('topicCount').get(function () {
  if (Array.isArray(this.topics) && this.topics.length > 0) {
    return this.topics.length;
  }
  return this.totalTopics || 0;
});

// Auto-update totalTopics count when topics array changes
CourseSchema.pre('save', function () {
  if (this.isModified('topics')) {
    this.totalTopics = this.topics.length;
  }
});

module.exports = mongoose.model('Course', CourseSchema);
