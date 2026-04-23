const express = require('express')
const {
	getAssessmentQuiz,
	getTopicQuiz,
	submitQuiz,
} = require('../controllers/quiz.controller.js')
const { protect } = require('../middleware/auth.middleware.js')

const router = express.Router()

// Get assessment quiz
router.get('/assessment', protect, getAssessmentQuiz)

// Get topic quiz by ID
router.get('/:quizId', protect, getTopicQuiz)

// Submit quiz
router.post('/submit', protect, submitQuiz)

module.exports = router
