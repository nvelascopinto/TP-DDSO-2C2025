import ProductoService from "../services/productoService.js"
import { convertJSONtoProducto } from "../conversores/conversoresProducto.js"

class ProductoController {
  constructor(productoService) {
    this.productoService = productoService
  }

  crear(req, res) {
    const body = req.body
    const producto = convertJSONtoProducto(body)
    const nuevoProducto = this.productoService.crear(producto)

    return res.status(201).json(nuevoProducto)
  }
}

export default new ProductoController(ProductoService)
