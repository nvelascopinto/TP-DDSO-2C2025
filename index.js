
import dotenv from "dotenv"
import express from "express"
import { Server } from "./server.js"

import routes from "./routes/routes.js"
import { HealthController } from "./controllers/healthController.js"
import { PedidoController } from "./controllers/pedidoController.js"
import { PedidoService } from "./services/pedidoService.js"
import { PedidoRepository } from "./models/repositories/pedidoRepository.js" 
import { ProductoController } from "./controllers/productoController.js"
import { ProductoService } from "./services/productoService.js"
import { ProductoRepository } from "./models/repositories/productoRepository.js"
import { UsuarioService } from "./services/usuarioService.js"
import { UsuarioRepository } from "./models/repositories/usuarioRepository.js"
import { UsuarioController } from "./controllers/usuarioController.js"

const app = express()
app.use(express.json())

// Configuramos el puerto con el .env
const port = process.env.PORT || 3000
dotenv.config();

// Se envía al server el puerto
const server = new Server(app, port)

const healthController = new HealthController()

const productoRepository = new ProductoRepository()
const pedidoRepository = new PedidoRepository()
const usuarioRepository = new UsuarioRepository()
const usuarioService = new UsuarioService(usuarioRepository)
const pedidoService = new PedidoService(pedidoRepository, usuarioService, productoRepository)
const pedidoController = new PedidoController(pedidoService)
const usuarioController = new UsuarioController(usuarioService)
const productoService = new ProductoService(productoRepository, usuarioService)
const productoController = new ProductoController(productoService) 

server.setController(HealthController, healthController)
server.setController(PedidoController, pedidoController)
server.setController(ProductoController, productoController)
server.setController(UsuarioController, usuarioController)

routes.forEach(route => server.addRoute(route))
server.configureRoutes();



server.launch();
