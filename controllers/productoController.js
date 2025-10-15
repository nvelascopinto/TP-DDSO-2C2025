import productoService from "../services/productoService.js"
import { toPaginadoResponse, toProductoDTO } from "../converters/productoConverter.js"
import { productoValidator } from "../validators/productoValidator.js"
import { idMongoValidator } from "../validators/idValidator.js"
import { cambioProductoValidator } from "../validators/productoValidator.js"

class ProductoController {
  crear(req, res) {
    return Promise.resolve()
      .then(() => {
        const body = productoValidator.parse(req.body)
        const usuario = req.user
        const producto = toProductoDTO(body)
        return productoService.crear(producto, usuario)
      })
      .then((nuevoProducto) => {
        res.status(201).json(nuevoProducto)
      })
  }

  obtenerTodosDeVendedor(req, res) {
    return Promise.resolve()
      .then(() => {
        const vendedor = req.user
        const query = req.query
        console.log(query)
        const { minPrecio, maxPrecio, pagina, limite, nombre, categoria, descripcion, orden } = query
        const filtros = {
          minPrecio: parseFloat(minPrecio),
          maxPrecio: parseFloat(maxPrecio),
          nombre: nombre,
          categoria: categoria,
          descripcion: descripcion,
          orden: orden
        }
        const paginaNum = parseInt(pagina) || 1
        const limiteNum = parseInt(limite) || 5
        return productoService.obtenerTodosDeVendedor(vendedor, filtros, paginaNum, limiteNum)
      })
      .then((resultado) => res.status(200).json(toPaginadoResponse(resultado)))
  }

  actualizar(req, res) {
    return Promise.resolve()
      .then(() => {
        const vendedor = req.user
        const productoID = idMongoValidator.parse(req.params.id)
        const cambioProducto = cambioProductoValidator.parse(req.body)

        return productoService.actualizar(vendedor, productoID, cambioProducto)
      })
      .then((productoActualizado) => res.status(200).json(productoActualizado))
  }
}

export default new ProductoController()
