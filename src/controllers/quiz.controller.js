const Quiz = require('../models/Quiz.model.js')
const Topic = require('../models/Topic.model.js')
const Course = require('../models/Course.model.js')
const Progress = require('../models/Progress.model.js')
const User = require('../models/User.model.js')
const { sendSuccess, sendError } = require('../utils/response.utils.js')

const TRACKS = ['nodejs', 'dsa-cpp']

const getTrackFromPreference = (trackPreference = '') => {
	const value = String(trackPreference || '').toLowerCase()
	if (value.includes('backend')) {
		return 'nodejs'
	}
	if (value.includes('dsa')) {
		return 'dsa-cpp'
	}
	return 'other'
}

const pickAssessmentTrack = ({ quiz, answers, fallbackPreference }) => {
	const stats = {
		nodejs: { correct: 0, total: 0 },
		'dsa-cpp': { correct: 0, total: 0 },
	}

	quiz.questions.forEach((question, index) => {
		const track = TRACKS.includes(question.track) ? question.track : null
		if (!track) {
			return
		}

		stats[track].total += 1
		const selected = answers?.[index]
		if (typeof selected === 'number' && selected === question.correctAnswer) {
			stats[track].correct += 1
		}
	})

	const nodeRatio = stats.nodejs.total > 0 ? stats.nodejs.correct / stats.nodejs.total : -1
	const dsaRatio = stats['dsa-cpp'].total > 0 ? stats['dsa-cpp'].correct / stats['dsa-cpp'].total : -1

	if (nodeRatio > dsaRatio) {
		return { track: 'nodejs', stats }
	}
	if (dsaRatio > nodeRatio) {
		return { track: 'dsa-cpp', stats }
	}

	if (stats.nodejs.correct > stats['dsa-cpp'].correct) {
		return { track: 'nodejs', stats }
	}
	if (stats['dsa-cpp'].correct > stats.nodejs.correct) {
		return { track: 'dsa-cpp', stats }
	}

	const fallback = getTrackFromPreference(fallbackPreference)
	if (fallback !== 'other') {
		return { track: fallback, stats }
	}

	if (stats['dsa-cpp'].total > 0) {
		return { track: 'dsa-cpp', stats }
	}

	if (stats.nodejs.total > 0) {
		return { track: 'nodejs', stats }
	}

	return { track: 'other', stats }
}

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
		let computedLevel = null
		let computedTrack = 'other'
		let allottedCourse = null
		if (quiz.topicId) {
			const topic = await Topic.findById(quiz.topicId).select('courseId').lean()
			courseId = topic?.courseId || null
		}

		const correctAnswers = Math.max(
			0,
			Math.min(totalQuestions, Math.round((score / 100) * totalQuestions))
		)

		if (Boolean(isAssessment)) {
			if (score < 40) {
				computedLevel = 'beginner'
			} else if (score < 75) {
				computedLevel = 'intermediate'
			} else {
				computedLevel = 'advanced'
			}

			const trackSelection = pickAssessmentTrack({
				quiz,
				answers,
				fallbackPreference: req.user.onboarding?.track_preference,
			})
			computedTrack = trackSelection.track

			if (computedTrack !== 'other') {
				allottedCourse = await Course.findOne({
					isPublished: true,
					track: computedTrack,
					level: computedLevel,
				})
					.select('_id title level track')
					.lean()

				if (!allottedCourse) {
					allottedCourse = await Course.findOne({ isPublished: true, track: computedTrack })
						.sort({ createdAt: 1 })
						.select('_id title level track')
						.lean()
				}
			}

			await User.findByIdAndUpdate(req.user._id, {
				level: computedLevel,
				assessedTrack: computedTrack,
				allottedCourseId: allottedCourse?._id || null,
			})
		}

		await Progress.create({
			userId: req.user._id,
			quizId: quiz._id,
			topicId: quiz.topicId || null,
			courseId: courseId || allottedCourse?._id || null,
			isAssessment: Boolean(isAssessment),
			score,
			passingScore: quiz.passingScore,
			totalQuestions,
			correctAnswers,
			assessmentTrack: Boolean(isAssessment) ? computedTrack : null,
			recommendedCourseId: Boolean(isAssessment) ? allottedCourse?._id || null : null,
		})

		return sendSuccess(res, 200, 'Quiz submitted successfully', {
			score,
			level: computedLevel,
			track: Boolean(isAssessment) ? computedTrack : null,
			allottedCourse: Boolean(isAssessment)
				? {
					id: allottedCourse?._id || null,
					title: allottedCourse?.title || null,
					level: allottedCourse?.level || null,
					track: allottedCourse?.track || computedTrack,
				}
				: null,
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
