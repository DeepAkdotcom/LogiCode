import express from "express";
import { getAllSubmissions, getCountOfSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const submissionRouter = express.Router();

submissionRouter.route("/get-all-submissions").get(AsyncHandler(isLoggedIn), AsyncHandler(getAllSubmissions));
submissionRouter.route("/get-submission/:problemId").get(AsyncHandler(isLoggedIn), AsyncHandler(getSubmissionsForProblem));
submissionRouter.route("/get-submissions-count/:problemId").get(AsyncHandler(isLoggedIn), AsyncHandler(getCountOfSubmissionsForProblem));


export default submissionRouter