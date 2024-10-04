// Pending -> In Progress -> In QA Review -> QA Pass -> Completed
const expressAsyncHandler = require("express-async-handler")
const sendMail = require("../utils/sendMail")
const User = require("../models/userModel")
const Project = require("../models/projectModel")
const Task = require("../models/taskModel")
const uploadToCloudinary = require("../config/cloudinary")

const domain_url = process.env.DOMAIN_URL
exports.createTask =  expressAsyncHandler(async(req,res,next)=>{
   const {projectId} = req.params
    //Get userId
   const assignerId =   userId =  req.auth.id
   const{taskname,assignee,dueDate,description,priority,assigneeQA} = req.body
    //Validate data from client
    if(!taskname||!assignee||!dueDate||!description||!priority||!assigneeQA){
        res.status(400)
        throw new Error("Please fill all fields")
    }
    //Validate task name 
    const projectDetails = await Project.findById(projectId) .populate("tasks","taskname")
    if(!projectDetails){
        res.status(400)
        throw new Error("Project not available")
    }
    if(projectDetails.manager.toString() !== assignerId.toString()){
        res.status(400)
        throw new Error("Not authorized to create task")
    }
    const tasksInProjects = projectDetails.tasks
   tasksInProjects.forEach(taskInProjects=>{
    if(taskInProjects.taskname.toLowerCase() === taskname.toLowerCase()){
        res.status(400)
        throw new Error("Task already exist with such name on this project kindly change task name")
    }
   })
    //Get Task Workers ids
    const taskWorkerEmail = [assignee,assigneeQA]
    const taskWorkersId = []
    try {
        const areOnboarded = await User.find({email:taskWorkerEmail})
        if(areOnboarded.length !== taskWorkerEmail.length){
            res.status(400)
            throw new Error("Members are not onboarded on app")
        }
        //Extract members id
        areOnboarded.forEach(isOnboarded=>{
            taskWorkersId.push(isOnboarded._id)
        })
        const  taskassignee = areOnboarded[0]._id
        const  qaAssigned =  areOnboarded[1]._id
        //Ensure task workers are on the project list 
        const projectMembers = projectDetails.members
        taskWorkersId.forEach(taskWorkerId=>{
            if(!projectMembers.includes(taskWorkerId)){
                res.status(400)
                    throw new Error("Task assignees are not on project")
            } 
        })
        //Task with image description
        if (req.file) {
			const imgUrl = req.file.path
			const descriptionImage = "Crimson-Task-Manager"
			const result = await uploadToCloudinary(imgUrl,descriptionImage)
			const task = await Task.create({
                taskname,
                assigner: assignerId,
                assigneeQA:qaAssigned,
                project: projectId,
                assignee:taskassignee,
                issuedDate: new Date(),
                dueDate: new Date(dueDate),
                status: "Pending",
                description,
                priority,
				descriptionImg: {
					imgUrl: result.secure_url,
					publicId: result.public_id,
				},
			})

			res.status(201).json({ msg: "Task  successfully created", task })
			return
		}
    
        //Create task in db
        const task = await Task.create({
            taskname,
            assigner: assignerId,
            assigneeQA:qaAssigned,
            project: projectId,
            assignee:taskassignee,
            issuedDate: new Date(),
            dueDate: new Date(dueDate),
            status: "Pending",
            description,
            priority
        })
    
        if(!task){
            res.status(400)
            throw new Error("Task could not be created")
        }

        //res.status(201).json({ msg: "Task  successfully created", task })
        //Get task  in Db
        const justCreatedTask = await Task.findOne({taskname:taskname})
        if(!justCreatedTask){
            res.status(400)
            throw new Error("Task cannot be found")
        }
        const createdTaskId = justCreatedTask._id
        //Update task of Project task field with task id
        await Project.updateOne({_id:projectId},{$push:{tasks:justCreatedTask._id}})

        //Update Workers task id field
        await User.updateMany({_id:{$in:taskWorkersId}},{$push:{task:justCreatedTask._id}})
        //Send all concerned works 
            if(projectDetails.status ==="Pending"){
                await Project.findByIdAndUpdate({
                    _id:projectId,
                    status:"Active"
                })
            }
            //Sending emails to assignee and QA
            const assigneeLinkToTask =  `${domain_url}/api/v1/view-task/${justCreatedTask.id}/${assignee}`
            const qaLinkToTask =  `${domain_url}/api/v1/view-task/${justCreatedTask.id}/${assigneeQA}`
            const assigneeName = areOnboarded[0].firstname
            const assignerQAName = areOnboarded[1].firstname
    
            taskWorkerEmail.forEach(async function(workerEmail){
                if(workerEmail ===assignee){
                    const assigneePayload = {
                        name: assigneeName,
                        link: assigneeLinkToTask
                    }
                     await sendMail(
                        workerEmail,
                        taskname,
                        assigneePayload,
                        "./emailTemplates/taskCreated.handlebars"
                     )
                
                }else{
                    const qaPayload = {
                        name: assignerQAName,
                        link: qaLinkToTask
                    }
                     await sendMail(
                        workerEmail,
                        taskname,
                        qaPayload,
                        "./emailTemplates/taskCreated.handlebars"
                     )
                }
            })
            viewTask = await Task.findById(createdTaskId)
            .populate("project", "projectName -_id")
            .populate("assigner", "identifier -_id")
            .populate("assignee", "identifier -_id")
            .populate("assigneeQA", "identifier -_id")
            res.status(201).json({
                success : true,
                message : "Task successfully created all concerned parties alerted",
                viewTask
            })
    } catch (error) {
        next(error)
    }

})   
exports.acceptTask = expressAsyncHandler(async(req,res,next)=>{
        const {taskId} = req.params
          const userId =  req.auth.id
           try {
            const taskDetails = await Task.findById(taskId)
            if (!taskDetails) {
                res.status(404)
                throw new Error("Task not found");
            }

            if(userId === taskDetails.assignee && taskDetails.status === "Pending"){
                 await Task.findByIdAndUpdate({taskId, status: "In Progress"})
                res.status(201).json({
                    success : true,
                    message: "Task accepted and moved to In Progress"
                })

            }else if (userId === taskDetails.qa && taskDetails.status === "Assignee Completed"){
                 await Task.findByIdAndUpdate({taskId, status: "QA Review"})
                res.status(201).json({
                    success : true,
                    message: "Task accepted and moved to In QA Review"
                })
            }else{
                res.status(400)
                throw new Error("Task cannot be accepted at this time you might not be an active participator")
            }

           } catch (error) {
            next(error)
           }
        })

exports.submitTask = expressAsyncHandler(async(req,res,next)=>{
            const {taskId} = req.params
            const userId = req?.auth?.id
        if (!userId) {
        res.status(400)
        throw new Error("Please Login to continue")
        }

          try {
            taskDetails = await Task.findById(taskId)
            if (!taskDetails) {
                return res.status(404).send("Task not found");
            }
            if(userID === taskDetails.assignee && taskDetails.status === "In Progress"){
                await Task.findByIdAndUpdate({taskId, status: "Assignee Completed"})
                res.status(201).json({
                    success : true,
                    message: "Task submitted and moved to Assignee Completed"
                })

            }else if (userID === taskDetails.qa && taskDetails.status === "QA Review"){
                await Task.findByIdAndUpdate({taskId, status: "QA Review Completed"})
                res.status(201).json({
                    success : true,
                    message: "Task submitted and moved to In QA Review Completed"
                })
            }else{
                res.status(400)
                throw new Error("Task cannot be submitted at this time you might not be an active participator")
            }
          } catch (error) {
            next(error)
          }

  })
        
exports.viewTask = expressAsyncHandler(async(req,res,next)=>{
            //Validate PM
            const userId = req.auth.id
            const {taskId}= req.params
        try {
            const task = await Task.findById(taskId) 
            .populate("project", "projectName ")
            .populate("assigner", "identifier -_id")
            .populate("assignee", "identifier -_id")
            .populate("assigneeQA", "identifier -_id")
            if(!task){
                res.status(400)
                throw new Error("Task")
            }
            const projectDetails = await Project.findById(task.project)
            if(!projectDetails){
                res.status(400)
                throw new Error("Task not linked to project")
            }
            if(!projectDetails.members.includes(userId)){
                res.status(400)
                throw new Error("Unauthorised to view task")
            }
            res.status(200).json({
                success : true,
                task
            })
        } catch (error) {
            next(error)
        }

})

exports.viewAllTaskOfProject = expressAsyncHandler(async(req,res,next)=>{
            const pageSize = 10
	        const page = Number(req.query.pageNumber) || 1
            const {projectId} = req.params
            const userId = "66feb27e98da29a9d2b0a169"
           try {
            const projectDetails = await Project.findById(projectId)

            if(!projectDetails.members.includes(userId)){
                res.status(400)
                throw new Error("Unauthorised to view tasks")
            }
            const viewAllTask = await Project.findById(projectId)
            .populate("tasks", "taskname")
            .populate("manager", "identifier -_id")
            .populate("members", "identifier -_id")
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .lean()
            res.status(200).json({
                success: true,
                viewAllTask
            })
           } catch (error) {
                next(error)
           }
        })

exports.updateTaskDetails = expressAsyncHandler(async(req,res,next)=>{
        const {assignee,assignerQA,description,dueDate,priority} = req.body
        const {taskId} = req.params
        const userId =  req.auth.id
        try {

            const task = await Task.findById(taskId)
            if(!task){
                res.status(400)
                throw new Error("Task not available")
            }
            const projectId = task.project
            //Validate req body one after the other
            if(userId.toString() !== task.assigner.toString()){
                res.status(400)
                throw new Error("Not permitted to update task details")
            }
            if(assignee){
        
                const isOnboarded = await User.findOne({email:assignee})
                if(!isOnboarded){
                    res.status(400)
                    throw new Error("Participator not onboarded")
                }
                const assigneeMemberId = isOnboarded._id
                const projectAffliatedToTask = await Project.findById(projectId)
                const projectMembers = projectAffliatedToTask.members
                if(!projectMembers.includes(assigneeMemberId)){
                    res.status(400)
                    throw new Error("Cannot participate on task not a member of the project")
                }
                task.assignee = assigneeMemberId || task.assignee
            }
            if(assignerQA){
                const isOnboarded = await User.findOne({email:assignerQA})
                if(!isOnboarded){
                    res.status(400)
                    throw new Error("Participator not onboarded")
                }
                const assignerQAMemberId = isOnboarded._id

                const projectAffliatedToTask = await Project.findById(projectId)
                const projectMembers = projectAffliatedToTask.members
                if(!projectMembers.includes(assignerQAMemberId)){
                    res.status(400)
                    throw new Error("Cannot participate on task not a member of the project")
                }
                task.assignerQA = assignerQAMemberId || task.assignerQA
            }

            if(description){
                task.description = description || task.description
            }

            if(dueDate){
                task.dueDate = new Date(dueDate) || task.dueDate
            }

            if(priority){
                task.priority =priority || task.priority
            }

            if (req.file) {
                const imgUrl = req.file.path
                const descImage = "crimson-connect-user-avatar"
    
                const result = await uploadToCloudinary(imgUrl, avatar)
    
                const task = await Task.updateOne({_id:taskId},
                   { profileImg: {
                        imgUrl: result.secure_url,
                        publicId: result.public_id,
                    },
            })
    
                res.status(201).json({ msg: "Task details successfully Updated", task })
                return
            }
                await task.save()

                res.status(200).json({
                    success:true,
                    message: "Task information successfully updated",
                    task

                })
        } catch (error) {
            next(error)
        }
    })

