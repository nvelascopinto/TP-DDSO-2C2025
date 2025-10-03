import ProductoRepository from "../models/repositories/productoRepository.js"
import UsuarioService from "./usuarioService.js"
import productoValidator from "../validators/productoValidator.js"
import { monedaValidator } from "../validators/monedaValidator.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { Producto } from "../models/entities/producto.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"

class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository
    this.usuarioService = usuarioService
  }

  crear(productoDTO) {
    const resultProducto = this.convertirDTOaProducto(productoDTO)

    const productoGuardado = this.productoRepository.crear(resultProducto)

    return productoGuardado
  }

  convertirDTOaProducto(productoDTO) {
    const resultProd = productoValidator.safeParse(productoDTO)

    if (resultProd.error) {
      throw new DatosInvalidosError(resultProd.error.issues.map((i) => i.message))
    }

    const resultProducto = resultProd.data
    const moneda = monedaValidator(productoDTO.moneda)

    if (!moneda) {
      throw new DatosInvalidosError(
        "La moneda ingresada no esta dentro de las opciones ofrecidas",
      )
    }

    const vendedor = this.usuarioService.obtenerUsuario(productoDTO.vendedorID, [
      tipoUsuario.VENDEDOR,
    ])

    return new Producto(
      vendedor,
      resultProducto.titulo,
      resultProducto.descripcion,
      resultProducto.categoria,
      resultProducto.precio,
      moneda,
      resultProducto.stock,
      resultProducto.fotos,
      resultProducto.activo,
    )
  }

  obtenerProducto(id) {
    return this.productoRepository.findById(id)
  }

  obtenerTodosDeVendedor(vendedor) {
    return this.productoRepository.obtenerTodosDeVendedor(vendedor)
  }
}

export default new ProductoService(ProductoRepository, UsuarioService)
