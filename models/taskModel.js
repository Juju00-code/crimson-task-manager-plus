const mongoose = require ("mongoose");
const validator = require("validator")


const taskSchema = new mongoose.Schema(
    {
        taskname :String,
        assignedby:{
            type: Schema.types.ObjectId,
            ref: "User",
            required: true
        },
        assignedto:{
            type: Schema.types.ObjectId,
            ref: "User",
            required: true
        },
        assignedqa:{
            type: Schema.types.ObjectId,
            ref: "User",
            required: true
        },
        project:{
            type: Schema.types.ObjectId,
            ref: "Project",
            required: true
        },
        description: String,
        comments: [String],
        status:{
            type: Number,
			default: 1,
			enum: [1,2,3,4,5,6],
            //enum [Pending,InProgress]
        },
        Priority:{
            type: Number,
			default: 1,
			enum: [1,2,3],
        },

        assigneddate: {
            type: Date,
            required: true
        },

        duedate:{
            type: Date,
            required: true
        }

    },{ timestamps: true }
)