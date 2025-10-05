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

  listarPorVendedor(req, res) {
    const idVendedor = req.vendedor.id //chequear como es q lo trae el middleware
    return ProductoService.obtenerTodosDeVendedor(idVendedor).then((productos) => {
      res.status(200).json(productos)
    })
  }
}

export default new ProductoController(ProductoService)