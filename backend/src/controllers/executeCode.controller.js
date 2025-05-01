import { pollBatchresults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
    const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;
    const userId  =  req.user.id;
    try {
        //validate tc's
        if(!Array.isArray(expected_outputs) || !Array.isArray(stdin) || stdin.length === 0 || expected_outputs.length !== stdin.length){
            return res.status(400).json({
                success: false,
                message: "Invalid or missing test cases"
            })
        }

        //prepare each tc for judg0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin:input
        }));

        //send the batch of submissions to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.submissions.map((res) => res.token);

        // pool judge0 for the results of all submitted tc's

        const results = await pollBatchresults(tokens);
        
        //validate that all tc's are passed
        console.log('Results-----------')
        console.log(results);

        res.status(200).json({
            success: true,
            message: "Code executed successfully",
            results
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while executing code"
        })
    }
}