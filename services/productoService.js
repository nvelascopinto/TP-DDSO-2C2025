import ProductoRepository from "../models/repositories/productoRepository.js"
import UsuarioService from "./usuarioService.js"
import { productoValidator } from "../validators/productoValidator.js"
import { validarMoneda } from "../validators/monedaValidator.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { Producto } from "../models/entities/producto.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"

class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository
    this.usuarioService = usuarioService
  }

  crear(productoDTO) {
    const resultProducto = this.convertirDTOaProducto(productoDTO)

    const productoGuardado = this.productoRepository.crear(resultProducto)

    console.log(this.productoRepository.productos)

    return productoGuardado
  }

  convertirDTOaProducto(productoDTO) {
    const resultProd = productoValidator.safeParse(productoDTO)

    if (resultProd.error) {
      throw new DatosInvalidosError(resultProd.error.issues.map((i) => i.message))
    }

    const resultProducto = resultProd.data
    validarMoneda(productoDTO.moneda)

    const vendedor = this.usuarioService.obtenerUsuario(productoDTO.vendedorID, [
      tipoUsuario.VENDEDOR,
    ])

    return new Producto(
      vendedor,
      resultProducto.titulo,
      resultProducto.descripcion,
      resultProducto.categoria,
      resultProducto.precio,
      productoDTO.moneda,
      resultProducto.stock,
      resultProducto.fotos,
      resultProducto.activo,
    )
  }

  obtenerProducto(id) {
    console.log("Buscando producto con id:", id)
    const producto = this.productoRepository.findById(id)
    console.log("Producto encontrado:", producto)
    validarExistenciaDeProducto(producto, id)

    return producto
  }

  obtenerTodosDeVendedor(vendedor) {
    return this.productoRepository.obtenerTodosDeVendedor(vendedor)
  }
}

export default new ProductoService(ProductoRepository, UsuarioService)
