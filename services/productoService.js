import ProductoRepository from "../models/repositories/productoRepository.js"
import UsuarioService from "./usuarioService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { Producto } from "../models/entities/producto.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"

class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository
    this.usuarioService = usuarioService
  }

  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO) {
    const resultProducto = this.convertirDTOaProducto(productoDTO)

    const productoGuardado = this.productoRepository.crear(resultProducto)

    return productoGuardado
  }

  convertirDTOaProducto(productoDTO) {
    const vendedor = this.usuarioService.obtenerUsuario(productoDTO.vendedorID, [
      tipoUsuario.VENDEDOR,
    ])

    return new Producto(
      vendedor,
      productoDTO.titulo,
      productoDTO.descripcion,
      productoDTO.categoria,
      productoDTO.precio,
      productoDTO.moneda,
      productoDTO.stock,
      productoDTO.fotos,
      productoDTO.activo,
    )
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
   
    //validarExistenciaDeProducto(producto, id)

    return this.productoRepository.findById(id).then((producto)=> producto)
  }

  obtenerTodosDeVendedor(vendedor) {
    return this.productoRepository.obtenerTodosDeVendedor(vendedor).then((prodVendedor) => prodVendedor)
  }
}

export default new ProductoService(ProductoRepository, UsuarioService)
