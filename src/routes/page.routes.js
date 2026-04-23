const express = require("express")
const path = require("path")

const router = express.Router()
const publicDir = path.join(__dirname, "..", "..", "public")

router.get("/", (req, res) => {
	res.sendFile(path.join(publicDir, "index.html"))
})

router.get("/login", (req, res) => {
	res.sendFile(path.join(publicDir, "login.html"))
})

router.get("/signup", (req, res) => {
	res.sendFile(path.join(publicDir, "register.html"))
})

router.get("/register", (req, res) => {
	res.redirect("/signup")
})

router.get("/dashboard", (req, res) => {
	res.sendFile(path.join(publicDir, "dashboard.html"))
})

router.get("/onboarding", (req, res) => {
	res.sendFile(path.join(publicDir, "onboarding.html"))
})

router.get("/quiz", (req, res) => {
	res.sendFile(path.join(publicDir, "quiz.html"))
})

router.get("/assessment", (_req, res) => {
	res.sendFile(path.join(publicDir, "assessment.html"))
})

router.get("/courses", (req, res) => {
	res.sendFile(path.join(publicDir, "courses.html"))
})

// Temporary safe fallbacks for flows that navigate to pages not yet implemented.
router.get("/path", (req, res) => {
	res.redirect("/courses")
})

router.get("/topic", (req, res) => {
	res.redirect("/courses")
})

router.get("/results", (req, res) => {
	res.redirect("/dashboard")
})

router.get("/profile", (req, res) => {
	res.redirect("/dashboard")
})

router.get("/dashboard.html", (req, res) => {
	res.redirect("/dashboard")
})

router.get("/path.html", (req, res) => {
	res.redirect("/path")
})

router.get("/topic.html", (req, res) => {
	res.redirect("/topic")
})

router.get("/results.html", (req, res) => {
	res.redirect("/results")
})

router.get("/profile.html", (req, res) => {
	res.redirect("/profile")
})

module.exports = router
