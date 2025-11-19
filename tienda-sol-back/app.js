import express from "express"
import router from "./routes/index.js"
import cors from 'cors'
const app = express()

const allowedOrigins = [
  'https://tiendasol10.netlify.app',
  'http://localhost:3002'
  
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)



export default app
