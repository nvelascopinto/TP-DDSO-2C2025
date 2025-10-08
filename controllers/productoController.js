import {productoServiceInstance} from "../services/productoService.js"
import { toProductoDTO } from "../converters/productoConverter.js"
import { productoValidator } from "../validators/productoValidator.js"

class ProductoController {
  crear(req, res) {
    return Promise.resolve()
      .then(() => {
        const body = productoValidator.parse(req.body)
        const usuario = req.user
        const producto = toProductoDTO(body)
        return productoServiceInstance.crear(producto, usuario)
      })
      .then((nuevoProducto) => {
        res.status(201).json(nuevoProducto)
      })
  }

  obtenerTodosDeVendedor(req, res) {
    return Promise.resolve()
      .then(() => {
        const vendedor = req.vendedor
        const query = req.body
        console.log(query)
        const { minPrecio, maxPrecio, pagina, limite, nombre, categoria, descripcion } =
          query
        const { ordenPrecio, ordenMasVendios, ascendente } = query
        const filtros = {
          minPrecio: parseFloat(minPrecio),
          maxPrecio: parseFloat(maxPrecio),
          nombre: nombre,
          categoria: categoria,
          descripcion: descripcion,
        }
        const ordenamiento = {
          ordenPrecio: ordenPrecio,
          ordenMasVendios: ordenMasVendios,
          ascendente: ascendente,
        } 
        return productoServiceInstance.obtenerTodosDeVendedor(
          vendedor,
          filtros,
          pagina,
          limite,
          ordenamiento,
        )
      })
      .then((productos) => {
        res.status(200).json(productos)
      })
  }
}

export default new ProductoController(productoServiceInstance)
