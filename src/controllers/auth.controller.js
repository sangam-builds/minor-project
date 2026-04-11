const bcrypt = require("bcryptjs")
const User = require("../models/User.model.js")
const { generateToken } = require("../utils/jwt.utils.js")
const { sendSuccess, sendError } = require("../utils/response.utils.js")

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

module.exports = {
	register,
	login,
	getProfile,
}
