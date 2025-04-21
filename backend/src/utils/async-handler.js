import { ApiError } from "./api-error.js"

function AsyncHandler(requestHandler){
    return function (req, res ,next){
        Promise.resolve(requestHandler(req, res, next))
                .catch((err)=>{
                    new ApiError(err.statusCode, err.message, err.errors, err.stack)
                    next(err)
                })
    }
}