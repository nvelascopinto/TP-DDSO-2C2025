import express from "express"
import router from "./routes/index.js"
import cors from 'cors'
const app = express()
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)



export default app
