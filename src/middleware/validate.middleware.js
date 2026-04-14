const { sendError } = require("../utils/response.utils.js")

const validate = (validator) => {
	return (req, res, next) => {
		const errors = validator(req.body || {})

		if (errors.length > 0) {
			return sendError(res, 400, "Validation failed", errors)
		}

		next()
	}
}

module.exports = {
	validate,
}
