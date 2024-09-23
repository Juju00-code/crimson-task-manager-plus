const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema(
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
        password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
		},
        roles: {
            type:String,
            default:["test"]
        },

        privileges:{
            type:String,
            default:"Tier 3",
            enum:["Tier 1","Tier 2","Tier 3"]
        },

        projects:{
              type:[Schema.Types.ObjectId],
            ref:"Project"
        },

        task:{
              type:[Schema.Types.ObjectId],
            ref:"Task"
        },
        isVerified: {
			type: Boolean,
			default: false,
		},

    },{ timestamps: true }
)