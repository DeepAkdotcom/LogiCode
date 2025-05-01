import expreess from "express"
import { isLoggedIn } from "../middlewares/auth.middleware";
import { executeCode } from "../controllers/executeCode.controller";

const executeCodeRouter = expreess.Router();


executeCodeRouter.route("/").post(AsyncHandler(isLoggedIn),AsyncHandler(executeCode))



export default executeCodeRouter;
