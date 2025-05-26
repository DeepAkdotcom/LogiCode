import { db } from "../libs/db.js";
import { getLanguageName, pollBatchresults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const executeCode = async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    //validate tc's
    if (!Array.isArray(expected_outputs) || !Array.isArray(stdin) || stdin.length === 0 || expected_outputs.length !== stdin.length) {
        throw new ApiError(400, "nvalid or missing test cases");
    }

    //prepare each tc for judg0 batch submission
    const submissions = stdin.map((input) => ({
        source_code,
        language_id,
        stdin: input
    }));

    //send the batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // pool judge0 for the results of all submitted tc's

    const results = await pollBatchresults(tokens);

    //validate that all tc's are passed
    // console.log('Results-----------')
    // console.log(results);

    //analyse the results
    let allPassed =  true;
    let detailedResults = results.map((result, i)=>{
        const stdout = result.stdout?.trim();
        const expected_output = expected_outputs[i]?.trim();
        const passed = stdout === expected_output;

        if(!passed) allPassed = false;

        return {
            testCase : i+1,
            passed,
            stdout,
            expectedOutput : expected_output,
            stderr : result.stderr || null,
            compiledOutput : result.compile_output || null,
            status : result.status.description,
            memory : result.memory?`${result.memory} KB`: undefined,
            time : result.time?`${result.time} S`: undefined,
        }
    })

    console.log(detailedResults);

    //store submission summary
    const submission = await db.submission.create({
        data:{
            userId,
            problemId,
            sourceCode:source_code,
            language: getLanguageName(language_id),
            stdin: stdin.join("\n"),
            stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
            stderr: detailedResults.some((r)=>r.stderr)?JSON.stringify(detailedResults.map((r)=>r.stderr)) : null,
            compiledOutput: detailedResults.some((r)=>r.compile_output)?JSON.stringify(detailedResults.map((r)=>r.compile_output)) : null,
            status: allPassed?"Accepted":"Wrong Answer",
            memory: detailedResults.some((r)=>r.memory)?JSON.stringify(detailedResults.map((r)=>r.memory)) : null,
            time: detailedResults.some((r)=>r.time)?JSON.stringify(detailedResults.map((r)=>r.time)) : null
        }
    })

    // If allPassed = true, mark problem as solved for the current user
    if(allPassed){
        await db.problemSolved.upsert({
            where:{
                userId_problemId:{
                    userId, problemId
                }
            },
            update:{},
            create:{
                userId, problemId
            }
        })
    }

    // save individual tc's
    const testCaseResults = detailedResults.map((result)=>({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expectedOutput: result.expectedOutput,
        stderr: result.stderr,
        compiledOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time
    }))

    await db.testCaseResult.createMany({
        data: testCaseResults
    })

    const submissionWithTestCase = await db.submission.findUnique({
        where:{
            id: submission.id
        },
        include:{
            testCases: true
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, submissionWithTestCase, "Code executed successfully"));
}