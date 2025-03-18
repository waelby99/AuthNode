import express from "express";
import {isAuthenticated, login, logout, register, sendVerifyOtp, verifiedEmail} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/sendverifycode',userAuth,sendVerifyOtp)
authRouter.post('/verify',userAuth,verifiedEmail)
authRouter.post('/isauth',userAuth,isAuthenticated)


export default authRouter;