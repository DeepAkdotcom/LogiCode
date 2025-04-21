import express from "express";
import { forgotPassword, loginUser, logoutUser, profile, registerUser, resetpassword, verifyUser} from "../controllers/auth.controller.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const authRouter = express.Router()

authRouter.route("/register").post(AsyncHandler(registerUser))
authRouter.route("/verify/:token").get(AsyncHandler(verifyUser))
authRouter.route("/login").post(AsyncHandler(loginUser))
authRouter.route("/me").get(AsyncHandler(isLoggedIn), AsyncHandler(profile))
authRouter.route("/logout").get(AsyncHandler(isLoggedIn), AsyncHandler(logoutUser))
authRouter.route("/forgot").post(AsyncHandler(forgotPassword));
authRouter.route("/resetpassword/:token").get(AsyncHandler(resetpassword));

export default authRouter