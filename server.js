const express= require("express")
const app= express()
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, ".env") })
const cors = require("cors")
const connectDB = require("./src/config/db.js")
const authRoutes = require("./src/routes/auth.routes.js")
const { notFoundHandler, errorHandler } = require("./src/middleware/error.middleware.js")

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
    // res.json({ message: "Backend is running" })
})

app.use("/api/auth", authRoutes)
app.use(notFoundHandler)
app.use(errorHandler)
app.use(express.static(path.join(__dirname, "public")))

const PORT = process.env.PORT || 3000

const startServer = async () => {
    await connectDB()

    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT} url: http://localhost:${PORT}`)
    })
}

startServer()