const express = require("express")
const expressAsyncHandler = require("express-async-handler")
const Project = require("../models/projectModel")


exports.createProject = expressAsyncHandler(async (req, res, next) => {
    const {projectName} = req.body
    console.log(projectName)
    //const{userId} = req.params
    //authmiddleware to get user Id
    if(!projectName){
        res.status(400)
        throw new  Error("Kindly fill in name of project")
    }

    //TODO //How to avoid project duplicate
        //Fetch projectname and userid , find in db (findone /find) if projectname and userid match we let it known the project has been created
        //standardise string format () query with new variable in lowercase
        
    try {
        const project = await Project.create({
            projectName,
            manager : "wrawew045i3234e093534e34et4ffe4",
            status:"Pending"
        })
    
        if (!project){
            res.status(400)
            throw new Error("The project could not be created")
        }
        res.status(200).json({
            success:true,
            project
        })
        
    } catch (error) {
        next(error)
    }
})


exports.addProjectMembers =  expressAsyncHandler(async (req, res, next) => {
    //Validate PM making request
    //Validate members is in registered users
    const {projectMembersEmail} = req.body 
    const {userId,projectId} = req.params
    if (!projectMembersEmail){
        res.status(400)
        throw new Error("Fiil in project member")
    }
    projectMembersEmail.forEach(async function(projectMemberEmail) {
        //Two ways to execute below logic precoditoner or populate 
        //I will like find by email and update project[] with projectId
        //let member = await User.findOne({email:projectMemberEmail})
        //then send mail to member say they are part of this project(with there memberId and ProjectId)
    
    })
        
    });


exports.removeProjectMembers =  expressAsyncHandler(async (req, res, next) => {})

exports.viewProject =expressAsyncHandler(async (req, res, next) => {
    const {projectId} = req.params
    const projectDetails = await Project.findById(projectId)
    //How can I validate this scenario where I make the request to db validate userID is in Project.member and return a boolean
    if(!projectDetails.members.includes(userId)){
        res.status(400)
        throw new Error("Project Access Denied")
    }

    res.status(200).json({
        success : true,
        projectDetails
})

})

exports.viewAllProject = expressAsyncHandler(async (req, res, next) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    //const {userId} = req.params
    const userProjects = await User.findById(userId)

    //Will this work since the data is already from the db
    //Search below either by directly from db  or loop through object  or 
    const myProjects = userProjects.projects.select("projectNames","status").sort({Status:1}).limit(pageSize).skip(pageSize * (page - 1)).lean

    res.status(200).json({
        success: true,
        myProjects
    })
})

//exports.viewAllProjectbyManager = expressAsyncHandler(async (req, res, next) => {}
//viewAllProjects

exports.upDateProjectStatus =  expressAsyncHandler(async (req, res, next) => {
    //
    //const {userId,projectId} = req.params
    const {newStatus} = req.body

    //Update 
})

exports.isCompleted =  expressAsyncHandler(async (req, res, next) => {})
