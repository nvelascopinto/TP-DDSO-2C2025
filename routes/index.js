import express from "express"
import healthRouter from "./healthRoutes.js";
import pedidoRouter from "./pedidoRoutes.js";
import productoRouter from "./productoRoutes.js";
import usuarioRouter from "./usuarioRoutes.js";
import notificacionRouter from "./notificacionRoutes.js";

const router = express.Router();

router.use(healthRouter)
router.use('/pedidos', pedidoRouter)
router.use('/productos', productoRouter)
router.use('/usuarios', usuarioRouter)
router.use('/notificaciones', notificacionRouter)

export default router;