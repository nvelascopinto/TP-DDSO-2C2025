import ProductoService from "../services/productoService.js"
import { toProductoDTO } from "../converters/productoConverter.js"
import { productoValidator } from "../validators/productoValidator.js"

class ProductoController {
  crear(req, res) {
    const body = productoValidator.parse(req.body)
    const producto = toProductoDTO(body)

    return ProductoService.crear(producto).then((nuevoProducto) => {
      res.status(201).json(nuevoProducto)
    })
  }

  obtenerTodosDeVendedor(req, res) {
    const idVendedor = req.vendedor.id //chequear como es q lo trae el middleware
    const { minPrecio, maxPrecio, pagina, limite, nombre, categoria, descripcion } = req.query
    const filtros = { minPrecio: parseFloat(minPrecio), maxPrecio: parseFloat(maxPrecio), nombre : nombre , categoria : categoria, descripcion : descripcion}
    return ProductoService.obtenerTodosDeVendedor(idVendedor, filtros, pagina, limite).then(
      (productos) => {
        res.status(200).json(productos)
      }
    )
  }
}

export default new ProductoController(ProductoService)
