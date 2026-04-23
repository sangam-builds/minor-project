const mongoose = require('mongoose');

// ── Embedded Question Schema ──────────────────────────────────────────────
const QuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: 'Each question must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Answer index must be 0 or above'],
      max: [3, 'Answer index cannot exceed 3'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    track: {
      type: String,
      enum: ['nodejs', 'dsa-cpp', 'other'],
      default: 'other',
    },
    explanation: {
      type: String,
      default: '',
      // shown to student after they answer — optional but great for learning
    },
  },
  { _id: true }
);

// ── Quiz Schema ───────────────────────────────────────────────────────────
const QuizSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
      // null when isAssessment is true
    },
    isAssessment: {
      type: Boolean,
      default: false,
      // true  → initial skill assessment quiz (shown once after registration)
      // false → regular topic quiz (shown after studying a topic)
    },
    questions: {
      type: [QuestionSchema],
      required: [true, 'Quiz must have at least one question'],
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: 'Quiz must have at least 2 questions',
      },
    },
    timeLimit: {
      type: Number,
      default: 0,
      // time limit in minutes — 0 means no limit
    },
    passingScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
      // percentage required to pass (default 70%)
    },
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

// One quiz per topic
QuizSchema.index({ topicId: 1 }, { unique: true, sparse: true });
// sparse: true allows multiple documents where topicId is null (assessment quizzes)

// Index for finding the assessment quiz quickly
QuizSchema.index({ isAssessment: 1 });

// Virtual — total number of questions
QuizSchema.virtual('totalQuestions').get(function () {
  return this.questions ? this.questions.length : 0;
});

// Instance method — check a submitted answer
QuizSchema.methods.checkAnswer = function (questionIndex, selectedOption) {
  const question = this.questions[questionIndex];
  if (!question) return false;
  return question.correctAnswer === selectedOption;
};

// Instance method — score the entire quiz
QuizSchema.methods.scoreSubmission = function (submittedAnswers) {
  if (!Array.isArray(submittedAnswers)) {
    throw new Error('Submitted answers must be an array');
  }

  let correct = 0;
  const results = this.questions.map((q, index) => {
    const submitted = submittedAnswers[index];
    const isCorrect = submitted === q.correctAnswer;
    if (isCorrect) correct++;
    return {
      questionIndex: index,
      submitted,
      correct: q.correctAnswer,
      isCorrect,
      explanation: q.explanation || '',
    };
  });

  const total = this.questions.length;
  const percentage = Math.round((correct / total) * 100);

  return {
    score: correct,
    total,
    percentage,
    passed: percentage >= this.passingScore,
    results,
  };
};

module.exports = mongoose.model('Quiz', QuizSchema);
