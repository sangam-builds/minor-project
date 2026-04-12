const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const User = require("../models/User.model.js")
const { generateToken } = require("../utils/jwt.utils.js")
const { sendSuccess, sendError } = require("../utils/response.utils.js")
const { getGoogleUserFromAccessToken } = require("../services/googleAuth.service.js")

const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body

		const existingUser = await User.findOne({ email: email.toLowerCase() })
		if (existingUser) {
			return sendError(res, 409, "User already exists with this email")
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const user = await User.create({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword,
		})

		const token = generateToken({ userId: user._id.toString(), email: user.email })

		return sendSuccess(res, 201, "User registered successfully", {
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		})
	} catch (error) {
		next(error)
	}
}

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email: email.toLowerCase().trim() })
		if (!user) {
			return sendError(res, 401, "Invalid credentials")
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return sendError(res, 401, "Invalid credentials")
		}

		const token = generateToken({ userId: user._id.toString(), email: user.email })

		return sendSuccess(res, 200, "Login successful", {
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		})
	} catch (error) {
		next(error)
	}
}

const getProfile = async (req, res) => {
	return sendSuccess(res, 200, "Profile fetched successfully", {
		user: req.user,
	})
}

const logout = (req, res) => {
	return sendSuccess(res, 200, "Logout successful")
}

const googleClientConfig = (req, res) => {
	const clientId = process.env.GOOGLE_CLIENT_ID

	if (!clientId) {
		return sendError(res, 503, "Google authentication is not configured")
	}

	return sendSuccess(res, 200, "Google config fetched", { clientId })
}

const googleAuth = async (req, res, next) => {
	try {
		const { accessToken } = req.body

		if (!accessToken || typeof accessToken !== "string") {
			return sendError(res, 400, "Google access token is required")
		}

		if (!process.env.GOOGLE_CLIENT_ID) {
			return sendError(res, 503, "Google authentication is not configured")
		}

		const googleProfile = await getGoogleUserFromAccessToken(accessToken)
		const normalizedEmail = googleProfile.email.toLowerCase().trim()
		const googleId = googleProfile.googleId || googleProfile.sub

		let user = await User.findOne({
			$or: [{ email: normalizedEmail }, ...(googleId ? [{ googleId }] : [])],
		})

		if (!user) {
			const generatedPassword = crypto.randomBytes(32).toString("hex")
			const hashedPassword = await bcrypt.hash(generatedPassword, 10)

			user = await User.create({
				name: googleProfile.name || normalizedEmail.split("@")[0],
				email: normalizedEmail,
				password: hashedPassword,
				googleId,
				authProvider: "google",
			})
		} else if (googleId && !user.googleId) {
			user.googleId = googleId
			user.authProvider = user.authProvider || "google"
			await user.save()
		}

		const token = generateToken({ userId: user._id.toString(), email: user.email })

		return sendSuccess(res, 200, "Google authentication successful", {
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	login,
	getProfile,
	logout,
	googleClientConfig,
	googleAuth,
}
