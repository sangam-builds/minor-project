const path = require("path")
const { sendError } = require("../utils/response.utils.js")

const notFoundHandler = (req, res) => {
	if (req.accepts("html") && !req.path.startsWith("/api")) {
		return res.status(404).sendFile(path.join(__dirname, "..", "..", "public", "404.html"))
	}

	if (req.accepts("json") || req.path.startsWith("/api")) {
		return sendError(res, 404, "Route not found")
	}

	return res.status(404).type("txt").send("Route not found")
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
