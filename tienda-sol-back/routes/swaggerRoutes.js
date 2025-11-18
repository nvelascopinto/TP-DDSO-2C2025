import express from "express"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const router = express.Router()

const notificaciones = YAML.load(`${process.cwd()}/docs/notificaciones.yaml`)
const pedidos = YAML.load(`${process.cwd()}/docs/pedidos.yaml`)
const productos = YAML.load(`${process.cwd()}/docs/productos.yaml`)
const sesion = YAML.load(`${process.cwd()}/docs/sesion.yaml`)
const tiendas = YAML.load(`${process.cwd()}/docs/tiendas.yaml`)
const usuarios = YAML.load(`${process.cwd()}/docs/usuarios.yaml`)

router.get("/notificaciones.yaml", (req, res) => res.json(notificaciones))
router.get("/pedidos.yaml", (req, res) => res.json(pedidos))
router.get("/productos.yaml", (req, res) => res.json(productos))
router.get("/sesion.yaml", (req, res) => res.json(sesion))
router.get("/tiendas.yaml", (req, res) => res.json(tiendas))
router.get("/usuarios.yaml", (req, res) => res.json(usuarios))

const options = {
  explorer: true,
  swaggerOptions: {
    urls: [
      { url: "/docs/notificaciones.yaml", name: "Notificaciones" },
      { url: "/docs/pedidos.yaml", name: "Pedidos" },
      { url: "/docs/productos.yaml", name: "Productos" },
      { url: "/docs/sesion.yaml", name: "Sesion" },
      { url: "/docs/tiendas.yaml", name: "Tiendas" },
      { url: "/docs/usuarios.yaml", name: "Usuarios" }
    ],
    supportedSubmitMethods: []
  }
}

router.use("/", swaggerUi.serve, swaggerUi.setup(null, options))

export default router
