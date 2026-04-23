const express = require("express")
const { protect } = require("../middleware/auth.middleware.js")
const {
	getDashboardSummary,
	getAssessmentStatus,
} = require("../controllers/progress.controller.js")

const router = express.Router()

router.get("/dashboard", protect, getDashboardSummary)
router.get("/assessment-status", protect, getAssessmentStatus)

module.exports = router
