const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


const verfToken = process.env.JWT_SECRET_KEY

const requireSignIn = asyncHandler(async (req, res, next) => {
	try {
		const cookieToken = req.cookies
		console.log( cookieToken)
		if (!cookieToken) {
			return res
				.status(401)
				.json({ message: "Login Failure" })
		}

		if (cookieToken) {
			jwt.verify(cookieToken._ctm_token, verfToken, async (err, decoded) => {
				if (err) return res.sendStatus(403)
				const userId = decoded.userId
				console.log(userId)
				const user = await User.findById(userId)
				if (!user) {
					return res.status(401).json({ message: "User not found" })
				}

				req.auth = user
				next()
			})
		} else {
			return res
				.status(401)
				.json({ message: "Invalid token. Login to continue" })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ message: "Internal server error" })
	}
})

const isAdmin = asyncHandler(async (req, res, next) => {
	const roles = req?.auth?.applicationRole

	if (roles !== 1) {
		return res
			.status(401)
			.json({ message: "You are not authorized to perform this action" })
	}

	next()
})

const isPM = asyncHandler(async (req, res, next) => {
	const roles = req?.auth?.applicationRole

	if (roles !== 2) {
		return res
			.status(401)
			.json({ message: "You are not authorized to perform this action" })
	}

	next()
})

module.exports = { requireSignIn, isAdmin,isPM }