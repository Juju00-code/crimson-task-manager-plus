const mongoose = require("mongoose")
const validator = require("validator")
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
    {
        firstName :{
            type:String,
            required:true,
            trim:true,
            //validate : [validator.isAlphanumeric,"First Name must only contain letters and numbers and it is required"]
            
        },

        lastName: {
			type: String,
			required: true,
			trim: true,
			/*validate: [
				validator.isAlphanumeric,
				"Last Name must only contain letters and numbers and it is required",
			],*/
		},

        email: {
			type: String,
			required: true,
			trim: true,
			//unique: true,
			lowercase: true,
			//validate: [validator.isEmail, "Please provide a valid email"]

            
		},
        password: {
			type: String,
			//required: true,
			trim: true,
			minlength: 8,
            select: false,
			trim: true,
			/*validate: [
				validator.isStrongPassword,
				"Password must be at least 8 characters long, with at least 1 uppercase and lowercase letters and at least 1 symbol",
			]*/
		},
        identifier: {
            type: String,
            unique: true,
            //required: true, 
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

        projects:{
              type:[Schema.Types.ObjectId],
            ref:"Project"
        },

        task:{
              type:[Schema.Types.ObjectId],
            ref:"Task"
        },
        isOnboarded: {
			type: Boolean,
            required:true,
			default: false,
		},
        active: {
			type: Boolean,
			default: true,
		}

    },{ timestamps: true }
)
/*userSchema.pre('save', function (next) {
    // Concatenate firstName and lastName to create identifier
    if (this.firstName && this.lastName) {
        this.identifier = `${this.firstName.toLowerCase()} ${this.lastName.toLowerCase()}`;
    }
    next();
})*/
const User = mongoose.model("User", userSchema)
module.exports = User