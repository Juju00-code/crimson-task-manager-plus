const express = require("express")
const expressAsyncHandler = require("express-async-handler")
const Project = require("../models/projectModel")
const User = require("../models/userModel")
const sendEmail = require("../utils/sendMail")
const { assign } = require("nodemailer/lib/shared")

const domain_url = process.env.DOMAIN_URL

exports.createProject = expressAsyncHandler(async (req, res, next) => {
    const {projectName} = req.body
    const pm = req.auth.id
    if(!projectName){
        res.status(400)
        throw new  Error("Kindly fill in name of project")
    }
    //TODO //How to avoid project duplicate
        //Fetch projectname and userid , find in db (findone /find) if projectname and userid match we let it known the project has been created
        //standardise string format () query with new variable in lowercase
        
    try {
        const isExisting = await Project.find({projectName:projectName,managers:pm})
        if(isExisting.length !== 0 ){
            res.status(400)
            throw new Error("You already created such a project")
        }
        const project = await Project.create({
            projectName,
            manager : pm,
            status:"Pending",
            members : pm
        })
        await Project.updateOne({_id:project._Id},{members:pm})
    
        if (!project){
            res.status(400)
            throw new Error("The project could not be created")
        }
        const viewProject = await Project.findOne(project._id).populate("manager", "identifier -_id")
        if(!viewProject){
            res.status(400)
            throw new Error("Project not found")
        }
        res.status(200).json({
            success:true,
            message:"Project successfully created",
            viewProject
        })
        
    } catch (error) {
        next(error)
    }
})


exports.addProjectMembers =  expressAsyncHandler(async (req, res, next) => {
    const {projectMembersEmail} = req.body 
    const {projectId} = req.params
    //Validate UserId
    assignerId = req.auth.id
      const projectDetails = await Project.findOne({_id:projectId})
      if(assignerId !== projectDetails.manager.toString()){
        res.status(400)
        throw new Error("Task cannot be created")
    }
    if (projectMembersEmail === 0){
        res.status(400)
        throw new Error("Fill in project member")
    }
    try {
        //HK. Validate members is in registered users
        const membersId = []
        const areOnboarded = await User.find({email:projectMembersEmail})
        if(areOnboarded.length < projectMembersEmail.legth || areOnboarded.length > projectMembersEmail.length){
            res.status(400)
            throw new Error("Members are not onboarded on app")
        }
        //Extract members id
        areOnboarded.forEach(isOnboarded=>{
            membersId.push(isOnboarded._id)
        })
    
        //Validate Users are  already on project 
        //const membersOnProject = await Project.findOne({_id:projectId},{members:1,_id:0})
        const membersOnProject = projectDetails.members
        membersId.forEach(memberId=>{
            if(membersOnProject.includes(memberId)){
                res.status(400)
                throw new Error("User/s already exist on project")
            }
        })
        //Insert id into project id members
        await Project.updateOne({_id:projectId},{members:membersId})
        
        //Add project Id Project Member's project array field
       await User.updateMany({_id:{$in:membersId}},{$push:{projects:projectId}})
        //Send mail to projects members
        projectMembersEmail.forEach(async function(projectMemberEmail){
            let projectLink = `${domain_url}/api/v1/project/view-project/${projectId}`
            let memberName
            for(const member of areOnboarded){
                if (projectMemberEmail.includes(member.email)){
                    memberName = member.firstName
                    break
                }
            }
            payload = {
                name:memberName,
                link:projectLink
            }
           
                await sendEmail(projectMemberEmail,"Project Onboarding" ,payload, "./emailTemplates/viewProject.handlebars");
                
        })
        res.status(200).json({
            success:true,
            message: "Members have been added to project and alerted"
        })
    } catch (error) {
        next(error)
    }
    })

exports.removeProjectMembers =  expressAsyncHandler(async (req, res, next) => {
    const {projectMembersEmail} = req.body 
    const {projectId} = req.params
    //Validate PM 
    assignerId =  req.auth.id
    const projectDetails = await Project.findOne({_id:projectId})
    if(assignerId !== projectDetails.manager.toString()){
      res.status(400)
      throw new Error("Not authorized")
  }
    if (projectMembersEmail === 0){
        res.status(400)
        throw new Error("Select Project member/s to remove")
    }
    try {
        //HK. Validate members is in registered users
        const membersId = []
        const areOnboarded = await User.find({email:projectMembersEmail})
        if(areOnboarded.length < projectMembersEmail || areOnboarded.length > projectMembersEmail ){
            res.status(400)
            throw new Error("Members are not onboarded on app")
        }
        //Extract members id
        areOnboarded.forEach(isOnboarded=>{
            membersId.push(isOnboarded._id)
        })
        //Validate Users do not  exist on project 
        const membersOnProject = await Project.findOne({_id:projectId},{members:1})
        membersId.forEach(memberId=>{
            if(!membersOnProject.members.includes(memberId)){
                res.status(400)
                throw new Error("User/s is not on the project")
            }
        })
        //delete id from project id members
        const deleteID = await Project.updateOne({_id:projectId},{ $pull: { members: {$in:membersId} }})
        //HK Model pre condition to add project Id Project Member project array field
        await User.updateMany({_id:{$in:membersId}},{$pull:{projects:projectId}})
        //Send mail to projects members
        projectMembersEmail.forEach(async function(projectMemberEmail){
            let projectLink = `Your service was greatly appreciated on${membersOnProject.projectName} at this time your requirement on this project is duly done thank you`
            let memberName
            for(const member of areOnboarded){
                if (projectMemberEmail.includes(member.email)){
                    memberName = member.firstName
                    break
                }
            }
            payload = {
                name:memberName,
                link:projectLink
            }
            await sendEmail(projectMemberEmail,"Removed From Project" ,payload, "./emailTemplates/viewProject.handlebars");
        })  
        res.status(200).json({
            success:true,
            message: "Members have been removed from project and alerted"
        })
    } catch (error) {
        next(error)
    }
})

exports.userViewProjects=expressAsyncHandler(async (req, res, next) => {
    //Get userId
    const userId =  req.auth.id
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    const userProjects = await User.findOne({_id:userId})
    .populate({path:"projects", select:"projectName status"})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean()
    const viewUserProjects = userProjects.projects
    res.status(200).json({
        success : true,
        viewUserProjects
    })
})

exports.viewAllProject = expressAsyncHandler(async (req, res, next) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    const projects = await Project.find()
    .populate("manager","identifier")
    .populate("members","identifier")
    .populate("tasks","taskname")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean()
    res.status(200).json({
        success: true,
        projects
    })
})

exports.viewProject = expressAsyncHandler(async (req, res, next) => {
    //Get user id
    userId = req.auth.id
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        res.status(400).json
        throw new Error("Project not available")
    }
    if(!project.members.includes(userId)){
        res.status(400)
        throw new Error("Unauthorised to view projects")
    }
    const viewProject = await Project.findById(projectId).populate("manager", "identifier -_id")
    .populate("members", "identifier -_id")
    .populate("tasks", "tasknames")
    res.status(200).json({
        success:true,
        viewProject
    })

})

exports.isPending =  expressAsyncHandler(async (req, res, next) => {
    //Validate PM
    const {userStatus} = req.body
    const {projectId} = req.params
    const status = "Pending"
    if(!userStatus){
        res.status(400)
        throw new Error("Kindly input Project status")
    }
    
    if(userStatus.toLowerCase() !== status.toLowerCase()){
        res.status(400)
        throw new Error("Status not applicable")
    }

    const updateStatus = await Project.updateOne({_id:projectId},{status:status})
    res.status(200).json({
        success:true,
        message : `Project status is ${status}`,
        updateStatus
    })


})
exports.isActive =  expressAsyncHandler(async (req, res, next) => {
      userId =  req.auth.id
      const {userStatus} = req.body
      const {projectId} = req.params
      const status = "Active"
      if(!userStatus){
          res.status(400)
          throw new Error("Kindly input Project status")
      }
      if(userStatus.toLowerCase() !== status.toLowerCase()){
          res.status(400)
          throw new Error("Status not applicable")
      }
  
      const updateStatus = await Project.updateOne({_id:projectId},{status:status})
      res.status(200).json({
          success:true,
          message : `Project status is ${status}`,
          updateStatus
      })
  
})

exports.isCompleted =  expressAsyncHandler(async (req, res, next) => {
    userId =  req.auth.id
      const {userStatus} = req.body
      const {projectId} = req.params
      const status = "Completed"
      if(!userStatus){
          res.status(400)
          throw new Error("Kindly input Project status")
      }
      if(userStatus.toLowerCase() !== status.toLowerCase()){
          res.status(400)
          throw new Error("Status not applicable")
      }
  
      const updateStatus = await Project.updateOne({_id:projectId},{status:status})
      res.status(200).json({
          success:true,
          message : `Project status is ${status}`,
          updateStatus
      })
  
})

exports.isDeactivated =  expressAsyncHandler(async (req, res, next) => {
      //Validate PM
      const {userStatus} = req.body
      const {projectId} = req.params
      const status = "Deactivated"
      if(!userStatus){
          res.status(400)
          throw new Error("Kindly input Project status")
      }
      if(userStatus.toLowerCase() !== status.toLowerCase()){
          res.status(400)
          throw new Error("Status not applicable")
      }
  
      const updateStatus = await Project.updateOne({_id:projectId},{status:status})
      res.status(200).json({
          success:true,
          message : `Project status is ${status}`,
          updateStatus
      })
  
})
