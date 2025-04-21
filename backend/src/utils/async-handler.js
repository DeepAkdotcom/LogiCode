import { ApiError } from "./api-error.js"

function AsyncHandler(requestHandler){
    return function (req, res ,next){
        Promise.resolve(requestHandler(req, res, next))
                .catch((err)=>{
                    if (err instanceof ApiError) {
                        next(err);
                    } else {
                        // Otherwise, wrap it in a generic ApiError
                        next(
                            new ApiError(
                                err.statusCode || 500, // Default to 500 if no statusCode
                                err.message || "Internal server error",
                                err.errors || [err.message || "Unknown error"],
                                err.stack || ""
                            )
                        );
                    }
                })
    }
}

export {AsyncHandler}