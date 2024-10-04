    //Project state by default should be pending
const mongoose = require("mongoose")
const Schema = mongoose.Schema


   //Representing an array of objects refering to another model
    const projectSchema = new Schema(  
    {
        projectName:{
            type :String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },

        //addedBy 
        manager:{
            type: Schema.Types.ObjectId,
			//required: true,
			ref: "User",
        },

        members:{
            type:[Schema.Types.ObjectId],
            ref:"User"
        },
        tasks :{
            type: [Schema.Types.ObjectId],
            ref:"Task"
        },

        status:{
            type: String,
            default:"Pending",
            required:true,
            enum:["Pending","Active","Deactivated","Completed"]
        }

    },{ timestamps: true }

    )

    //prefunction target members field update push project id to users project
const Project = mongoose.model("Project",projectSchema)
module.exports = Project