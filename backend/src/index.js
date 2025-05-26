import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import healthcheckRouter from "./routes/healtcheck.routes.js"
import problemRouter from "./routes/problem.route.js"
import executeCodeRouter from "./routes/executeCode.route.js"
import cookieParser from "cookie-parser"
import submissionRouter from "./routes/submission.route.js"

const app = express()

dotenv.config()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use("/api/v1/healthcheck", healthcheckRouter)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/problems", problemRouter)
app.use("/api/v1/execute-code", executeCodeRouter)
app.use("/api/v1/submission", submissionRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})  


