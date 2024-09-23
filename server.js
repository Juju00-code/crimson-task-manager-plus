const express = require("express")
require("dotenv").config()
const colors = require("colors")
const ExpressMongoSanitize = require("express-mongo-sanitize")
const { notFound, errorHandler } = require("./middlewares/errorHandlers")
const mongodbConnection = require("./config/dbConfig")
const projectRouter = require("./routes/projectRoutes")

// connection to database
mongodbConnection()

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
//*cors
//cookies parser
app.use(ExpressMongoSanitize())
//logger


const PORT = process.env.PORT || 4789
//Routes
/*fs.readdirSync(path.join(__dirname, "routes")).map((file) => {
	const route = require(`./routes/${file}`)
	app.use("/api/v1", route)
})*/

app.use("/api/v1/project", projectRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running @ http://localhost:${PORT}`.blue.bold)
})