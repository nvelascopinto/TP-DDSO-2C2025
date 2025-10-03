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

  deEsteVendedor(req, res) {
    const idVendedor = req.vendedor.id //chequear como es q lo trae el middleware
    this.productoService.obtenerTodosDeVendedor(idVendedor)
  }
}

export default new ProductoController(ProductoService)
