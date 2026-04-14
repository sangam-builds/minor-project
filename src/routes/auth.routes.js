const express = require("express")
const {
	register,
	login,
	getProfile,
	logout,
	googleClientConfig,
	googleAuth,
	saveOnboarding,
} = require("../controllers/auth.controller.js")
const { protect } = require("../middleware/auth.middleware.js")
const { validate } = require("../middleware/validate.middleware.js")
const {
	validateRegister,
	validateLogin,
	validateOnboarding,
} = require("../validators/auth.validator.js")

const router = express.Router()

router.post("/register", validate(validateRegister), register)
router.post("/login", validate(validateLogin), login)
router.get("/google/config", googleClientConfig)
router.post("/google", googleAuth)
router.post("/onboarding", protect, validate(validateOnboarding), saveOnboarding)
router.get("/me", protect, getProfile)
router.post("/logout", protect, logout)

module.exports = router
