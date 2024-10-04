const express = require("express")
const {createProject,
    addProjectMembers
    ,removeProjectMembers,
    userViewProjects,
    viewAllProject,
    viewProject,
    isPending
    ,isActive,
    isCompleted,
    isDeactivated
}= require("../controllers/projectController")
const { requireSignIn,isPM, isAdmin } = require("../middlewares/authMiddleware")
const projectRouter = express.Router()



projectRouter.post("/create",requireSignIn,isPM,createProject)
projectRouter.put("/addmember/:projectId",requireSignIn,isPM,addProjectMembers)
projectRouter.put("/removemember/:projectId",removeProjectMembers)
projectRouter.get("/view-user-projects",requireSignIn,userViewProjects)
projectRouter.get("/view-all-projects",isAdmin,viewAllProject)
projectRouter.get("/view-project/:projectId",requireSignIn,viewProject)
projectRouter.put("/status-pending/:projectId",requireSignIn,isPM,isPending)
projectRouter.put("/status-active/:projectId",requireSignIn,isPM,isActive)
projectRouter.put("/status-completed/:projectId",requireSignIn,isPM,isCompleted)
projectRouter.put("/status-deactivated/:projectId",requireSignIn,isPM,isDeactivated)



module.exports = projectRouter