import express from "express"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const router = express.Router()
const usuarios = YAML.load(`${process.cwd()}/docs/usuarios.yaml`)
const productos = YAML.load(`${process.cwd()}/docs/productos.yaml`)
const notificaciones = YAML.load(`${process.cwd()}/docs/notificaciones.yaml`)
const pedidos = YAML.load(`${process.cwd()}/docs/pedidos.yaml`)

router.use("/usuarios", swaggerUi.serve, swaggerUi.setup(usuarios))
router.use("/productos", swaggerUi.serve, swaggerUi.setup(productos))
router.use("/notificaciones", swaggerUi.serve, swaggerUi.setup(notificaciones))
router.use("/pedidos", swaggerUi.serve, swaggerUi.setup(pedidos))

export default router