const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Topic content is required'],
    },
    order: {
      type: Number,
      required: [true, 'Topic order is required'],
      min: [1, 'Order must be at least 1'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Topic must belong to a course'],
    },
    duration: {
      type: Number,
      default: 15,
      min: 1,
      // estimated reading time in minutes
    },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ['article', 'video', 'documentation', 'exercise'],
          default: 'article',
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index — fetch all topics for a course in order efficiently
TopicSchema.index({ courseId: 1, order: 1 });

// Ensure topic order is unique within a course
TopicSchema.index({ courseId: 1, order: 1 }, { unique: true });

// Virtual — link back to quiz (not stored)
TopicSchema.virtual('quiz', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'topicId',
  justOne: true,
});

module.exports = mongoose.model('Topic', TopicSchema);
