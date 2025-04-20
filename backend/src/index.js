import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express()

dotenv.config()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello Leetcode!")
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})  


