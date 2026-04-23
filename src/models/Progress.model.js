const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		quizId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz",
			required: true,
		},
		topicId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Topic",
			default: null,
		},
		courseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			default: null,
		},
		isAssessment: {
			type: Boolean,
			default: false,
		},
		score: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},
		passingScore: {
			type: Number,
			default: 70,
			min: 0,
			max: 100,
		},
		totalQuestions: {
			type: Number,
			required: true,
			min: 1,
		},
		correctAnswers: {
			type: Number,
			required: true,
			min: 0,
		},
		assessmentTrack: {
			type: String,
			enum: ["nodejs", "dsa-cpp", "other"],
			default: null,
		},
		recommendedCourseId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			default: null,
		},
		attemptedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
)

progressSchema.index({ userId: 1, createdAt: -1 })
progressSchema.index({ userId: 1, topicId: 1 })

module.exports = mongoose.model("Progress", progressSchema)
