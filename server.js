require("dotenv").config()
const connectDB = require("./src/config/db.js")
const { createApp } = require("./src/app.js")

const app = createApp()

const PORT = process.env.PORT || 3000

const startServer = async () => {
    await connectDB()

    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT} url: http://localhost:${PORT}`)
    })
}

startServer()