const expressAsyncHandler = require("express-async-handler");




exports.createUser = expressAsyncHandler(async(req,res,next)=>{
    const {firstname,lastname,email,password,roles,privileges,isVerified} = req.body
    try {

        const newUser = await User.create(
        {
            firstname,
            lastname,
            email,
            password,
            roles,
            privileges,
            isVerified
        })
    
		if (!newUser) {
			res.status(400)
			throw new Error("User  could not be created")
		}
        res.status(201).json({
			success: true,
			message: "User successfully added",
			customer,
		})
    }    
    catch (error) {
        next(error)
    }
})