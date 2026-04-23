const Quiz = require('../models/Quiz.model.js')
const Topic = require('../models/Topic.model.js')
const Progress = require('../models/Progress.model.js')
const User = require('../models/User.model.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

// Get assessment quiz
const getAssessmentQuiz = async (req, res, next) => {
	try {
		const quiz = await Quiz.findOne({ isAssessment: true, isPublished: true })

		if (!quiz) {
			return sendError(res, 404, 'Assessment quiz not found')
		}

		return sendSuccess(res, 200, 'Assessment quiz fetched', {
			quiz,
		})
	} catch (error) {
		next(error)
	}
}

// Get topic quiz by ID
const getTopicQuiz = async (req, res, next) => {
	try {
		const { quizId } = req.params

		const quiz = await Quiz.findOne({
			_id: quizId,
			isPublished: true,
		})

		if (!quiz) {
			return sendError(res, 404, 'Quiz not found')
		}

		return sendSuccess(res, 200, 'Quiz fetched', {
			quiz,
		})
	} catch (error) {
		next(error)
	}
}

// Submit quiz
const submitQuiz = async (req, res, next) => {
	try {
		const { quizId, isAssessment, answers, score } = req.body

		const quiz = await Quiz.findById(quizId)
		if (!quiz) {
			return sendError(res, 404, 'Quiz not found')
		}

		// Validate answer indices
		const totalQuestions = quiz.questions.length
		const answerValues = Object.values(answers).filter(val => val !== null)
		
		for (let idx of answerValues) {
			if (typeof idx === 'number' && (idx < 0 || idx >= 4)) {
				return sendError(res, 400, 'Invalid answer index')
			}
		}

		let courseId = null
		if (quiz.topicId) {
			const topic = await Topic.findById(quiz.topicId).select('courseId').lean()
			courseId = topic?.courseId || null
		}

		const correctAnswers = Math.max(
			0,
			Math.min(totalQuestions, Math.round((score / 100) * totalQuestions))
		)

		await Progress.create({
			userId: req.user._id,
			quizId: quiz._id,
			topicId: quiz.topicId || null,
			courseId,
			isAssessment: Boolean(isAssessment),
			score,
			passingScore: quiz.passingScore,
			totalQuestions,
			correctAnswers,
		})

		let computedLevel = null
		if (Boolean(isAssessment)) {
			if (score < 40) {
				computedLevel = 'beginner'
			} else if (score < 75) {
				computedLevel = 'intermediate'
			} else {
				computedLevel = 'advanced'
			}

			await User.findByIdAndUpdate(req.user._id, {
				level: computedLevel,
			})
		}

		return sendSuccess(res, 200, 'Quiz submitted successfully', {
			score,
			level: computedLevel,
			totalQuestions,
			passingScore: quiz.passingScore,
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getAssessmentQuiz,
	getTopicQuiz,
	submitQuiz,
}
