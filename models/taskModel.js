const mongoose = require ("mongoose");
const validator = require("validator")
const Schema = mongoose.Schema


const taskSchema = new mongoose.Schema(
    {
        taskname :String,
        assigner:{
            type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
        },
        assignee:{
            type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
        },
        assigneeQA:{
            type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
        },
        project:{
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        description:{
            type:String,
            required:true
        },

        descriptionImg: {
			imgUrl: String,
			publicId: String,
		},
        status:{
            type: String,
            required:true,
			default: "Pending",
			enum: ["Pending","In Progress","Dev Completed","In QA Review","QA Review Completed","Completed"],
           
        },
        priority:{
            type: String,
            required:true,
			default: "High",
			enum: ["Low","Medium","High"],
        },
        issuedDate: {
            type: Date,
            required: true
        },

        dueDate:{
            type: Date,
            required: true
        }

    },{ timestamps: true }
)

const Task = mongoose.model("Task", taskSchema)
module.exports = Task