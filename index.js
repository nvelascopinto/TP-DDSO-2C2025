
import dotenv from "dotenv"
import express from "express"
import { Server } from "./server.js"

import routes from "./routes/routes.js"
import { HealthController } from "./controllers/healthController.js"
import { PedidoController } from "./controllers/pedidoController.js"
import { PedidoService } from "./service/pedidoService.js"
import { pedidoRepository } from "./models/repositories/pedidoRepository.js" // cambiar a mayuscula
import { ProductoController } from "./controllers/productoController.js"
import { ProductoService } from "./service/productoService.js"
import { ProductoRepository } from "./models/repositories/productoRepository.js"

const app = express()
app.use(express.json())

// Configuramos el puerto con el .env
const port = process.env.PORT || 3000
dotenv.config();

// Se envía al server el puerto
const server = new Server(app, port)

const healthController = new HealthController()

const pedidoRepo = new pedidoRepository()
const pedidoService = new PedidoService(pedidoRepo)
const pedidoController = new PedidoController(pedidoService)

const productoRepo = new ProductoRepository()
const productoService = new ProductoService(productoRepo)
const productoController = new ProductoController(productoService) 

server.setController(HealthController, healthController)
server.setController(PedidoController, pedidoController)
server.setController(ProductoController, productoController)


routes.forEach(route => server.addRoute(route))
server.configureRoutes();



server.launch();
