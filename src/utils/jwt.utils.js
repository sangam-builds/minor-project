const jwt = require("jsonwebtoken")

const getJwtSecret = () => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined")
	}

	return process.env.JWT_SECRET
}

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || "7d") => {
	return jwt.sign(payload, getJwtSecret(), { expiresIn })
}

const verifyToken = (token) => {
	return jwt.verify(token, getJwtSecret())
}

module.exports = {
	generateToken,
	verifyToken,
}
