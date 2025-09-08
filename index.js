
import dotenv from "dotenv"
import express from "express"
import { Server } from "./server.js"

import routes from "./routes/routes.js"
import { HealthController } from "./controllers/healthController.js"


const app = express()
app.use(express.json())

// Configuramos el puerto con el .env
const port = process.env.PORT || 3000
dotenv.config();

// Se envía al server el puerto
const server = new Server(app, port)

const healthController = new HealthController()

server.setController(HealthController, healthController)

routes.forEach(route => server.addRoute(route))
server.configureRoutes();
server.launch();
