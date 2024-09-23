const express = require("express")
const projectRouter = express.Router()
const {createProject}= require("../controllers/projectController")



projectRouter.post("/create",createProject)


module.exports = projectRouter