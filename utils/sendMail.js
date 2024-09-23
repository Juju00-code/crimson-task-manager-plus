const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
//const { systemLogs } = require("../middlewares/logger")
const sendMail = async (email, subject, payload, template) => {
	const pathToEmailTemplate = fs.readFileSync(
		path.join(__dirname, template),
		"utf8"
	)
	console.log({pathToEmailTemplate})
	const compiledTemplate = handlebars.compile(pathToEmailTemplate)

	const options = {
		from: process.env.SENDER_EMAIL,
		to: email,
		subject: subject,
		html: compiledTemplate(payload),
	}
	console.log({options})
	let transportmail = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.USER_MAIL_ID,
			pass: process.env.USER_SECRET,
		},
	})

	transportmail.sendMail(options, function (err, res) {
		if (err) {
			console.log(err)
		} else {
			console.log("Email sent successfully",res)

		}
	})
}

module.exports = sendMail