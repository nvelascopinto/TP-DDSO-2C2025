import express from "express"
import router from "./routes/index.js"
import cors from 'cors'
const app = express()

app.use(router)

app.use(cors({
  origin: 'http://localhost:3001' // Cambia por el puerto de tu frontend
}))

export default app
