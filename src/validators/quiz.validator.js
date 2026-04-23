const validateQuizSubmission = (body = {}) => {
	const errors = []
	const { quizId, isAssessment, answers, score } = body

	if (!quizId || typeof quizId !== 'string') {
		errors.push('quizId is required and must be a string')
	}

	if (typeof isAssessment !== 'boolean') {
		errors.push('isAssessment must be a boolean')
	}

	if (typeof answers !== 'object' || answers === null || Array.isArray(answers)) {
		errors.push('answers must be an object')
	}

	if (typeof score !== 'number' || score < 0 || score > 100) {
		errors.push('score must be a number between 0 and 100')
	}

	return errors
}

module.exports = {
	validateQuizSubmission,
}
