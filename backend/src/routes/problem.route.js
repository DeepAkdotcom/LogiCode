import express from "express";
import { AsyncHandler } from "../utils/async-handler.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getproblemById, updateProblem } from "../controllers/problem.controller.js";

const problemRouter = express.Router();

problemRouter.route("/create-problem").post(AsyncHandler(isLoggedIn),AsyncHandler(isAdmin), AsyncHandler(createProblem))
problemRouter.route("/get-all-problems").get(AsyncHandler(isLoggedIn),AsyncHandler(getAllProblems))
problemRouter.route("/get-problem/:id").get(AsyncHandler(isLoggedIn),AsyncHandler(getproblemById))

problemRouter.route("/update-problem/:id").put(AsyncHandler(isLoggedIn), AsyncHandler(isAdmin),AsyncHandler(updateProblem))

problemRouter.route("/delete-problem/:id").delete(AsyncHandler(isLoggedIn), AsyncHandler(isAdmin),AsyncHandler(deleteProblem))

problemRouter.route("/get-solved-problems").get(AsyncHandler(isLoggedIn),AsyncHandler(getAllProblemsSolvedByUser))



export default problemRouter;