const express = require("express")
const path = require("path")
const cors = require("cors")

const authRoutes = require("./routes/auth.routes.js")
const pageRoutes = require("./routes/page.routes.js")
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware.js")

const createApp = () => {
	const app = express()

	app.use(cors())
	app.use(express.json())
	app.use(express.static(path.join(__dirname, "..", "public")))

	app.use("/", pageRoutes)
	app.use("/api/auth", authRoutes)
	app.use(notFoundHandler)
	app.use(errorHandler)

	return app
}

module.exports = {
	createApp,
}
