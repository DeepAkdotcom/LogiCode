import expreess from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";
import { AsyncHandler } from "../utils/async-handler.js";

const executeCodeRouter = expreess.Router();


executeCodeRouter.route("/").post(AsyncHandler(isLoggedIn),AsyncHandler(executeCode))



export default executeCodeRouter;
