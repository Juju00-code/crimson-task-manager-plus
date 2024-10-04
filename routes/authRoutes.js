const express = require("express")
const {onboardMember,login,testCreateUsers,userCompleteOnboarding,logout} = require("../controllers/authController")
const authRouter = express.Router()
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")

authRouter.post("/onboard",  requireSignIn,isAdmin,onboardMember)
authRouter.post("/complete-onboarding/:token",userCompleteOnboarding)
authRouter.post("/login", login)
authRouter.get("/logout", logout)


module.exports = authRouter