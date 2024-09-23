const mongoose = require("mongoose")
const validator = require("validator")

const employeeOnboardingSchema = new mongoose.Schema(
    {
        firstname :{
            type:String,
            required:true,
            trim:true,
            validate : [validator.isAlphanumeric,"First Name must only contain letters and numbers and it is required"]
            
        },

        lastname: {
			type: String,
			required: true,
			trim: true,
			validate: [
				validator.isAlphanumeric,
				"Last Name must only contain letters and numbers and it is required",
			],
		},

        email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
            TODO
            //Validate according to organization suffix i.e"@crimson.com"
            
		},
        roles: {
            type:[String],
            default:[IT],
            enum:[
                "PM",
                "Eng.Backend",
                "Eng.Frontend",
                "Eng.Devops",
                "Eng.Cloud",
                "Eng.QA",
                "Eng.Network",
                "Eng.SysAdmin",
                "Eng.DatabaseAdmin",
            ]
            
        },

        privileges:{
            type:[String],
            default:["Tier 3"],
            enum:["Tier 1","Tier 2","Tier 3"]
        },

        otp:{
            type:Number,
            TODO
            //Validate to 5-digits
        }
    }
)