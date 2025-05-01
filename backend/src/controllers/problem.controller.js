import {db} from "../libs/db.js"
import { pollBatchresults, submitBatch } from "../libs/judge0.lib.js";


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

    const {title, description, diffculty, tags, examples, constraints, testCases, codeSnippets, referenceSolutions} = req.body

    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({
            success: false,
            message: "You are not authorized to create problems"
        });
    }

    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language);   

            if(!languageId){
                return res.status(400).json({
                    success: false,
                    message: `Language ${language} is not supported`
                });
            }

            const submissions = testCases.map(({input, output}) => ({
                source_code : solutionCode,
                language_id : languageId,
                stdin : input,
                expected_output : output
            }));

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchresults(tokens);

            for(let i=0; i<results.length; i++){
                const result = results[i];

                if(result.status.id !== 3){
                    return res.status(400).json({
                        success: false,
                        message: `Test case ${i+1} failed for language ${language}`
                    });
                }
            }

            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    diffculty,
                    tags,
                    examples,
                    constraints,
                    testCases,
                    codeSnippets,
                    referenceSolutions, 
                    userId : req.user.id
                }
            })

            return res.status(201).json({
                success: true,
                message: "Problem created successfully",
                problem: newProblem
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Problem creation failed",
        })
    }
}
const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if(!problems){
            return res.status(404).json({
                success: false,
                message: "No problems found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "Error while fetching problems"
         })
    }
}
 
const getproblemById = async (req, res) => {
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {id}
        })

        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching the problem by Id"
        })
    }
}


const updateProblem = async (req, res) => {

}

const deleteProblem = async (req, res) => {
    const {id} = req.params;
    
   try {
     const problem = await db.problem.findUnique({
         where: {id}
     })
     
     if(!problem){
         return res.status(404).json({
             success: false,
             message: "Problem not found"
         });
     }
 
     await db.problem.delete({
         where: {id}
     })

     res.status(200).json({
         success: true,
         message: "Problem deleted successfully"
     })

   } catch (error) {
       return res.status(500).json({
           success: false,
           message: "Error while deleting the problem"
       })
   }
}

const getAllProblemsSolvedByUser = async (req, res) => {
    
}



export {
    createProblem,
    getAllProblems,
    getproblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser
}

