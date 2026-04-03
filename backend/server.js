import 'dotenv/config'
import userRoute from "./src/routes/userRoute.js"
import profileRoute from "./src/routes/profileRoute.js"
import postRouter from "./src/routes/postRoute.js"
import gameRouter from "./src/routes/gameRoute.js"
import globalMiddleware from "./src/middlewares/globalMiddleware.js"
import express from "express"
import cors from "cors"

const port = process.env.PORT
const host = process.env.HOST
const app = express()

app.use(cors())

app.use(express.json())
app.use(globalMiddleware.getIP)

app.use(userRoute)
app.use(profileRoute)
app.use(postRouter)
app.use(gameRouter)

app.listen(port, host, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})