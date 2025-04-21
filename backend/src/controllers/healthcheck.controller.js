import { ApiResponse } from "../utils/api-response.js"

const healthCheck = (req,res)=>{
    res.status(200).json(new ApiResponse(200,"Server is Running"))
};

export {healthCheck}