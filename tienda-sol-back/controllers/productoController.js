import productoService from "../services/productoService.js"
import { toPaginadoResponse, toProductoDTO } from "../converters/productoConverter.js"
import { productoValidator } from "../validators/productoValidator.js"
import { idMongoValidator } from "../validators/idValidator.js"
import { cambioProductoValidator } from "../validators/productoValidator.js"
import { filtrosValidator } from "../validators/filtrosValidator.js"
import { ZodValidationError } from "../errors/validationError.js"

class ProductoController {
  crear(req, res) {
    return Promise.resolve()
      .then(() =>
        productoValidator.parse(req.body)
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })
      .then((bodyProducto) => {
        const usuario = req.user
        const producto = toProductoDTO(bodyProducto)
        return productoService.crear(producto, usuario)
      })
      .then((nuevoProducto) =>
        res.status(201).json(nuevoProducto)
      )
  }

  obtenerTodosDeVendedor(req, res) {
    return Promise.resolve()
      .then(() => 
        filtrosValidator.parse(req.query)
      )
      .catch((e) => {
        throw new ZodValidationError(e)
      })      
      .then((query) => {
        const vendedor = req.vendedor
        const { pagina, limite, ...filtros } = query // Cualquier filtro que vayamos a agregar entra automáticamente a "filtros"
        return productoService.obtenerTodosDeVendedor(vendedor, filtros, pagina, limite)
      })
      .then((productos) => 
        res.status(200).json(toPaginadoResponse(productos))
      )
  }

  actualizar(req, res) {
    return Promise.resolve()
      .then(() => {
        const idProducto = idMongoValidator.parse(req.params.id)
        const cambioProducto = cambioProductoValidator.parse(req.body)
        return { idProducto, cambioProducto }
      })
      .catch((e) => {
        throw new ZodValidationError(e)
      })      
      .then(({ idProducto, cambioProducto }) =>
        productoService.actualizar(req.user, idProducto, cambioProducto)
      )
      .then((productoActualizado) => 
        res.status(200).json(productoActualizado)
      )
  }
}

export default new ProductoController()
