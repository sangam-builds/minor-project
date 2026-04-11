const { sendError } = require("../utils/response.utils.js")

const notFoundHandler = (req, res) => {
	return sendError(res, 404, "Route not found")
}

const errorHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err)
	}

	const statusCode = err.statusCode || 500
	return sendError(res, statusCode, err.message || "Internal server error")
}

module.exports = {
	notFoundHandler,
	errorHandler,
}
