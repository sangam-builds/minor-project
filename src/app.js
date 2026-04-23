const express = require("express")
const path = require("path")
const cors = require("cors")

const authRoutes = require("./routes/auth.routes.js")
const quizRoutes = require("./routes/quiz.routes.js")
const progressRoutes = require("./routes/progress.routes.js")
const courseRoutes = require("./routes/course.routes.js")
const pageRoutes = require("./routes/page.routes.js")
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware.js")

const createApp = () => {
	const app = express()

	app.use(cors())
	app.use(express.json())
	app.use(express.static(path.join(__dirname, "..", "public")))

	app.use("/", pageRoutes)
	app.use("/api/auth", authRoutes)
	app.use("/api/quiz", quizRoutes)
	app.use("/api/progress", progressRoutes)
	app.use("/api/course", courseRoutes)
	app.use(notFoundHandler)
	app.use(errorHandler)

	return app
}

module.exports = {
	createApp,
}
