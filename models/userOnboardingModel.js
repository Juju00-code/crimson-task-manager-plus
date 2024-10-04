const mongoose = require("mongoose")
const validator = require("validator")

const userOnboardingSchema = new mongoose.Schema(
    {
        firstName :{
            type:String,
            required:true,
            trim:true,
           
            
        },

        lastName: {
			type: String,
			required: true,
			trim: true,
		},

        email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
        organizationRole: {
            type:String,
            required:true 
        },

        applicationRole:{
            type:Number,
            default:3,
            enum:[1,2,3]
        },

        token: { 
            type: String, 
            required: true 
        },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: 600,
        }
       
    }
)

const Onboard = mongoose.model("Onboard",userOnboardingSchema)
module.exports = Onboard