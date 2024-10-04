const multer = require("multer")
const fs = require("fs")
const path = require("path")

if (!fs.existsSync("./uploads")) {
	fs.mkdirSync("./uploads")
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads")
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`${file.originalname.split(".")[0]}-${Date.now()}${path.extname(
				file.originalname
			)}`
		)
	},
})

const imgUpload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname)
		// .jpeg .png .jpg
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".PNG") {
			return cb(new Error("File type is not supported"), false)
		}
		cb(null, true)
	},
})

module.exports = imgUpload
