const User = require("../models/User.model.js")
const { verifyToken } = require("../utils/jwt.utils.js")
const { sendError } = require("../utils/response.utils.js")

const protect = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader) {
			return sendError(res, 401, "Authorization token missing")
		}

		const token = authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: authHeader

		if (!token) {
			return sendError(res, 401, "Authorization token missing")
		}

		const decoded = verifyToken(token)

		const user = await User.findById(decoded.userId).select("-password")
		if (!user) {
			return sendError(res, 401, "Invalid token user")
		}

		req.user = user
		next()
	} catch (error) {
		return sendError(res, 401, "Invalid or expired token")
	}
}

module.exports = {
	protect,
}
