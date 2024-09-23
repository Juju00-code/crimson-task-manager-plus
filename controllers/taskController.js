// Pending -> In Progress -> In QA Review -> QA Pass -> Completed
const expressAsyncHandler = require("express-async-handler")
const sendMail = require("../utils/sendMail")

TODO://Q. If a field references an Id of another model can the id be used to get data 
//i.e Project.task=[2334wdff334324,23434sfddfw3234]
//2334wdff334324.taskname

//Each user sent should go along with fullname,id,email and role
//I receive user email 1. enter usermodel to extract data then enter other tables  whiles the request could have 
//come with user{id,name,mail,tetc} if possible is it secure


//try catch blocks


exports.createTask =  expressAsyncHandler(async(req,res,next)=>{
    //Fetch data from client
   // const {assignerId,projectId} = req.params
    const{taskname,assignee,dueDate,description,priority} = req.body

    //Validate data from client
    if(!taskname||!assignee||!dueDate||!description||!priority||!qa){
        res.status(400)
        throw new Error("Please fill all fields")
    }
    //Ensure task workers are on the project list 
    const projectDetail = await Project.findById(projectId)
    const projectMembers = projectDetail.members //Find out method to only extract needed data
    if(!projectMembers.includes(assignee && qa)){
        res.status(400)
            throw new Error("Task assignees are not on project")
    }
    //Create task in db
    const task = await Task.create({
        taskname,
        assigner: assignerId,
        project: projectId,
        assignee,
        issuedDate: new Date(),
        dueDate,
        status: Pending,
        description,
        priority
    })


    //Get task  in Db
    const justCreatedTask = await Task.find({taskname:taskname})
    
    //Send all concerned works 
        if(projectDetail.status ==="Pending"){
            await Project.findByIdAndUpdate({
                projectId,
                status:"Active"
            })
        }
        //Sending emails to assignee and QA
        const getAssigneeEmail = await User.findById(assignee).select("email")
        const getQAEmail = await User.findById(qa).select("email")
        const taskConcerns = [getAssigneeEmail,getQAEmail]

        TODO://Uniform way to send email to all
        const assigneeLinkToTask =  `/api/v1/view-task/${justCreatedTask.id}/${assignee}`
        const qaLinkToTask =  `/api/v1/view-task/${justCreatedTask.id}/${qa}`

        taskConcerns.forEach(async function(taskConcern){
            if(taskConcern ===getAssigneeEmail){
                //Got error whiles using the try catch block
                const assigneePayload = {
                    name: assignee.name,
                    link: assigneeLinkToTask
                }
                 await sendMail(
                    getAssigneeEmail,
                    taskname,
                    assigneePayload,
                    "./email/templates/taskCreated"
                 )
            
            }else{
                const qaPayload = {
                    name: assignee.name,
                    link: qaLinkToTask
                }
                 await sendMail(
                    getAssigneeEmail,
                    taskname,
                    qaPayload,
                    "./email/templates/taskCreated"
                 )
            }
        })

        res.status(201).json({
            success : true,
            message : "Task successfully created all concerned parties alerted"
        })

})   
exports.acceptTask = expressAsyncHandler(async(req,res,next)=>{
           // const {userId, taskId} = req.params

            taskDetails = await Task.findById(taskId)

            if(!userId === taskDetails.assignee || !userId === taskDetails.qa){
                return res.sendStatus("You are not an assignee to this task")
            }
            
            //const taskAssigneeDetails = await User.findById(userId)

            if(userID === taskDetails.assignee && taskDetails.status === "Pending"){
                 await findByIdAndUpdate({taskId, status: "In Progress"})
                res.status(201).json({
                    success : true,
                    message: "Task accepted and moved to In Progress"
                })

            }else if (userID === taskDetails.qa && taskDetails.status === "Assignee Completed"){
                 await findByIdAndUpdate({taskId, status: "QA Review"})
                res.status(201).json({
                    success : true,
                    message: "Task accepted and moved to In QA Review"
                })
            }else{
                res.status(400)
                throw new Error("Task cannot be accepted at this time you might not be an active participator")
            }

        })

exports.submitTask = expressAsyncHandler(async(req,res,next)=>{
           // const {userId, taskId} = req.params

            taskDetails = await Task.findById(taskId)

            if(!userId === taskDetails.assignee || !userId === taskDetails.qa){
                return res.sendStatus("You are not an assignee to this task")
            }
            
            //const taskAssigneeDetails = await User.findById(userId)

            if(userID === taskDetails.assignee && taskDetails.status === "In Progress"){
                await findByIdAndUpdate({taskId, status: "Assignee Completed"})
                res.status(201).json({
                    success : true,
                    message: "Task submitted and moved to Assignee Completed"
                })

            }else if (userID === taskDetails.qa && taskDetails.status === "QA Review"){
                await findByIdAndUpdate({taskId, status: "QA Review Completed"})
                res.status(201).json({
                    success : true,
                    message: "Task submitted and moved to In QA Review Completed"
                })
            }else{
                res.status(400)
                throw new Error("Task cannot be submitted at this time you might not be an active participator")
            }

        })
        
exports.viewTask = expressAsyncHandler(async(req,res,next)=>{
            //const {userId,projectId,taskId}= req.params
            const projectDetails = await Project.find(projectId)

            if(!projectDetails.members.includes(userId)){
                res.status(400)
                throw new Error("Unauthorised to view task")
            }

            const viewTask = await Task.findById(taskId)

            res.status(200).json({
                success : true,
                viewTask
            })

        })

exports.viewAllTaskOfProject = expressAsyncHandler(async(req,res,next)=>{
            const pageSize = 10
	        const page = Number(req.query.pageNumber) || 1
            const {userId} = req.params
            const projectDetails = await Project.find(projectId)

            if(!projectDetails.members.includes(userId)){
                res.status(400)
                throw new Error("Unauthorised to view tasks")
            }
            //Will this work since the data is already from the db
            const viewAllTask = projectDetail.tasks.select("+taskname","+status","+priority").sort({Status:1}).limit(pageSize).skip(pageSize * (page - 1)).lean

            res.status(200).json({
                success: true,
                viewAllTask
            })
        })

exports.updateTaskDetails = expressAsyncHandler(async(req,res,next)=>{
        const {assignedto,assignedqa,description,duedate,Priority} = req.body
        //const {userId,projectId,taskId}=req.params
        //Fetch task id from client
        //fetch task from  db
        //validate user
        //
        const projectDetails = await Project.findById(projectId)
       
        if(!projectDetail.tasks.includes(taskId)){
            res.status(400)
                throw new Error("Task does not belong in this project")
            
        }
        //Validate req body one after the other

        if ((assignedto && assignedqa) || (assignedto || assignedqa)){
            const projectDetail = await Project.findById(projectId)
            const projectMembers = projectDetail.members //Find out method to only extract needed data
            if(!projectMembers.includes(assignee && qa)){
                res.status(400)
                    throw new Error("Task assignees are not on project")
            }
        }

        const fieldsUpdated = req.body

        const updateTask = await Task.findById(
            {_id:taskId},
            {...fieldsUpdated,taskId},
            {new:true, runValidators:true}
        )

            res.status(200).json({
                success:true,
                message: "Task information successfully updated",
                updateTask

            })
    })

   // exports.commentOnTask = expressAsyncHandler(async(req,res,next)=>{})

