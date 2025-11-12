import express from "express"
import healthRouter from "./healthRoutes.js"
import pedidoRouter from "./pedidoRoutes.js"
import productoRouter from "./productoRoutes.js"
import usuarioRouter from "./usuarioRoutes.js"
import notificacionRouter from "./notificacionRoutes.js"
import tiendaRouter from "./tiendaRoutes.js"
import sesionRouter from "./sesionRoutes.js"
import { errorHandler } from "../middleware/errorHandler.js"
import swaggerRoutes from "./swaggerRoutes.js"

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(healthRouter)
router.use("/docs", swaggerRoutes)
router.use("/pedidos", pedidoRouter)
router.use("/productos", productoRouter)
router.use("/usuarios", usuarioRouter)
router.use("/notificaciones", notificacionRouter)
router.use("/tiendas",tiendaRouter)
router.use("/sesiones", sesionRouter)

router.use(errorHandler)

export default router
