const cloudinary = require("cloudinary").v2
const fs = require("fs")
require("dotenv").config()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const cloudinaryUpload = async (pathToFile,folderName) => {
	try {
		const result = await cloudinary.uploader.upload(pathToFile, {
			folder: folderName,
		})
		fs.unlinkSync(pathToFile)
		return result
	} catch (error) {
		console.log("failed to upload file", error)
	}
}

module.exports = cloudinaryUpload
