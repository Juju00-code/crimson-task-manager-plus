const express = require("express")
const taskRouter = express.Router()
const {createTask,acceptTask,viewTask,viewAllTaskOfProject,updateTaskDetails, submitTask} = require("../controllers/taskController")
const imgUpload = require("../middlewares/uploadImage")
const { requireSignIn,isPM } = require("../middlewares/authMiddleware")



taskRouter.post("/create/:projectId", requireSignIn,isPM,imgUpload.single("descImage"),createTask)
taskRouter.put("/accept-task/:taskId", requireSignIn,acceptTask)
taskRouter.put("/accept-task/:taskId",requireSignIn,submitTask)
taskRouter.get("/view-task/:taskId",requireSignIn,viewTask)
taskRouter.get("/view-project-tasks/:projectId", requireSignIn,isPM,viewAllTaskOfProject)
taskRouter.put("/update-task-details/:taskId",requireSignIn,isPM,imgUpload.single("descImage"),updateTaskDetails)


module.exports = taskRouter