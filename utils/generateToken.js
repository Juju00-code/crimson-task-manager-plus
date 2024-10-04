const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateToken = (userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_SECRET_KEY_EXPIRY,
	})

	return token
}

module.exports = generateToken

