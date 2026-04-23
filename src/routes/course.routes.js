const express = require("express")
const { protect } = require("../middleware/auth.middleware.js")
const { getRecommendedCoursePlan } = require("../controllers/course.controller.js")

const router = express.Router()

router.get("/recommended", protect, getRecommendedCoursePlan)

module.exports = router
