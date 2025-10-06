import ProductoService from "../services/productoService.js"
import { toProductoDTO } from "../converters/productoConverter.js"
import { productoValidator } from "../validators/productoValidator.js"

class ProductoController {
  crear(req, res) {
    return Promise.resolve().then(()=>{
      const body = productoValidator.parse(req.body)
      const usuario = req.vendedor
      const producto = toProductoDTO(body)
      return ProductoService.crear(producto, usuario)
    }).then((nuevoProducto) => {
      res.status(201).json(nuevoProducto)
    })
  }

  obtenerTodosDeVendedor(req, res) {
    return Promise.resolve().then(() =>{
      const vendedor = req.vendedor
      const { minPrecio, maxPrecio, pagina, limite, nombre, categoria, descripcion } = req.query
      const filtros = { minPrecio: parseFloat(minPrecio), maxPrecio: parseFloat(maxPrecio), nombre : nombre , categoria : categoria, descripcion : descripcion}
      ProductoService.obtenerTodosDeVendedor(VTTRegionendedor, filtros, pagina, limite)
    }).then(
      (productos) => {
        res.status(200).json(productos)
      }
    )
  }
}

export default new ProductoController(ProductoService)
