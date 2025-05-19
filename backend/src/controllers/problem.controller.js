import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchresults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const createProblem = async (req, res) => {
  //get the data from the request body
  // check the user role once again
  // loop through each reference solution for different languages
  //get judge0 lang id for curr lang
  // prepare judge0 submission for all tc's
  // submit all tc's in one batch
  // extract tokens from response
  // poll judg0 until all submissions are done
  // validate that each tc is passed, (ststus.is === 3)
  // save the problem in the db after all validations are passed

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  console.log(req.user.role);

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to create problems");
  }

  for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      throw new ApiError(400, `Language ${language} is not supported`);
    }

    const submissions = testCases.map(({ input, output }) => ({
      source_code: solutionCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    console.log(submissions);

    const submissionResults = await submitBatch(submissions);

    const tokens = submissionResults.map((res) => res.token);

    console.log(tokens);

    const results = await pollBatchresults(tokens);

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("result------------>", result);
        // console.log(`testcase ${i + 1} and language ${language}-------result ${JSON.stringify.(result.status.description)}`);

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Invalid test case ${i + 1} for language ${language}`
        );
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id
      }
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newProblem, "Problem created successfully"));
  }
};

const getAllProblems = async (req, res) => {
  const problems = await db.problem.findMany();

  if (!problems) {
    throw new ApiError(404, "No problems found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problems, "Problems fetched successfully"));
};

const getproblemById = async (req, res) => {
  const { id } = req.params;

  const problem = await db.problem.findUnique({
    where: { id },
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, problem, "Problem fetched successfully"));
};

const updateProblem = async (req, res) => {};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
    // Find the problem by id
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      // If problem not found, return 404 status with error message
      throw new ApiError(404, "Problem not found");
    }

    // Delete the problem
    await db.problem.delete({
      where: { id },
    });

    // Return 200 status with success message
    return res.status(200).json(new ApiResponse(200, null, "Problem deleted successfully"));
};

const getAllProblemsSolvedByUser = async (req, res) => {};

export {
  createProblem,
  getAllProblems,
  getproblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
};
