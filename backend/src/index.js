import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import healthcheckRouter from "./routes/healtcheck.routes.js"

const app = express()

dotenv.config()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/healthcheck", healthcheckRouter)

app.use("/api/v1/auth", authRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})  


