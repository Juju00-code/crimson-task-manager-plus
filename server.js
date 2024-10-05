const express = require("express")
require("dotenv").config()
const fs = require("fs")
const colors = require("colors")
const ExpressMongoSanitize = require("express-mongo-sanitize")
const { notFound, errorHandler } = require("./middlewares/errorHandlers")
const mongodbConnection = require("./config/dbConfig")
const projectRouter = require("./routes/projectRoutes")
const taskRouter = require("./routes/taskRoutes")
const authRouter = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const mongoSanitize = require("express-mongo-sanitize")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")

// connection to database
mongodbConnection()

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(ExpressMongoSanitize())
app.use(cookieParser())

app.get("/", (req, res) => {
	res.send("Welcome to Crimson Task Manager Plus")
})


const PORT = process.env.PORT || 4789
//Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/task", taskRouter)



app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running @ http://localhost:${PORT}`.blue.bold)
})