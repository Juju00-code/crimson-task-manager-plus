const expressAsyncHandler = require("express-async-handler");
const express = require("express")
const User= require("../models/userModel")
const Onboard= require("../models/userOnboardingModel")
const sendEmail = require("../utils/sendMail")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generateToken")

const domain_url = process.env.DOMAIN_URL


exports.onboardMember = expressAsyncHandler(async(req,res,next)=>{
    const{firstName,lastName,email,organizationRole,applicationRole} = req.body
    //isOnboarded
    if (!firstName || !lastName || !email || !organizationRole || !applicationRole) {
		res.status(400)
		throw new Error("Please add all fields")
	}
    const memberExist = await User.findOne({email})
    if(memberExist){
        res.status(400)
		throw new Error("User is Onboarded")
    }

    const onboardingIncomplete = await Onboard.findOne({email})
    if(onboardingIncomplete){
        res.status(400)
		throw new Error("Uncompleted unboarding")
    }

    const verification_token = crypto.randomBytes(32).toString("hex")

    const userOnboard = await Onboard.create({
		firstName,
		lastName,
		email,
        organizationRole,
        applicationRole,
		token:verification_token
	})

    const emailLink = `${domain_url}/api/v1/auth/complete-onboarding/${userOnboard.token}/${userOnboard._id}`

	const payload = {
		name: userOnboard.firstname,
		link: emailLink,
	}
    try {
		await sendEmail(
			userOnboard.email,
			"Account Verification",
			payload,
			"./emailTemplates/onboarding.handlebars"
		)

		res.status(201).json({
			success: true,
			message: `Account created. A Verification email has been sent to your email. Please click on the verification link to verify your account.
                Verification link expires within 15 minutes`,
		})
	} catch (error) {
		next(error)
	}

})

exports.userCompleteOnboarding = expressAsyncHandler(async(req,res,next)=>{
   const {token} = req.params
   const {password,confirmPassword} = req.body

   const tempUser = await Onboard.findOne({token})
   console.log(`tempUser${tempUser}`)

   if (!tempUser) {
    res.status(400)
    throw new Error("We were unable to find a user for this token")
}

if(password !==confirmPassword ){
    res.status(400)
		throw new Error(
			"Password and Confirm password must match"
		)
}
if (password && password.length < 6) {
    res.status(400)
    throw new Error("Password must be at least 6 characters")
}
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

const user = await User.create({
    firstName : tempUser.firstName,
    lastName : tempUser.lastName,
    email : tempUser.email,
    password : hashedPassword,
	identifier : `${tempUser.firstName} ${ tempUser.lastName}`,
    organizationRole : tempUser.organizationRole,
    applicationRole : Number(tempUser.applicationRole),
    isOnboarded : true
})
const emailLink = `${domain_url}/api/v1/auth/login`

	const payload = {
		name: user.firstname,
		link: emailLink,
	}
	try {
		await sendEmail(
			user.email,
			"Account Verification",
			payload,
			"./emailTemplates/onboardingCompleted.handlebars"
		)

		res.status(201).json({
			success: true,
			message: `Onboarding completed kindly log on to begin working on projects`,
		})
	} catch (error) {
		next(error)
	}
})

exports.login = expressAsyncHandler(async(req,res,next)=>{
    try {
		// validate inputs
		const {email, password } = req.body

		if ((!email) || !password) {
			return res.status(400).json({ error: "Please enter username or email" })
		}

		const user = await User.findOne({email}).select(
			"+password"
		)

		if (!user) {
			return res.status(400).json({ error: "User not found" })
		}

		// compare password
		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" })
		}

		const token = generateToken(user.id)

		await user.save()
		const options = {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
			secure: true,
			sameSite: "None",
		}

		res.cookie("_ctm_token", token, options)

		res.status(200).json({ msg: "Logged in", token })
	} catch (error) {
		next(error)
	}
})

exports.logout = expressAsyncHandler(async (req, res) => {
	const cookies = req?.cookies
	//send userId

	if (!cookies?._ctm_token) {
		res.sendStatus(204)
		throw new Error("No cookie found")
	}
	res.clearCookie("_ctm_token", {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	})

	res.status(200).json({
		success: true,
		message: `You have been logged out successfully`,
	})
})
