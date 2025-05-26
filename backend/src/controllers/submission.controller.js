import { db } from "../libs/db";
import { ApiResponse } from "../utils/api-response";

export const getAllSubmissions = async (req, res) => {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
        where: {
            userId
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, submissions, "Submissions fetched successfully"))
}

export const getSubmissionsForProblem = async (req, res) => {
    const userId = req.user.id;
    const problemId = req.params.id;

    const submissions = await db.submission.findMany({
        where: {
            userId,
            problemId
        }
    })

    return res  
        .status(200)
        .json(new ApiResponse(200, submissions, "Submissions for problem fetched successfully"))

}

export const getCountOfSubmissionsForProblem = async (req, res) => {
    const problemId = req.params.problemId;
    const submissionCount = await db.submission.count({
        where:{
            problemId
        }
    })

    return res  
        .status(200)
        .json(new ApiResponse(200, submissionCount, "Submissions count for problem fetched successfully"))
}