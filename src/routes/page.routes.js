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

router.get("/dashboard.html", (req, res) => {
	res.redirect("/dashboard")
})

module.exports = router
