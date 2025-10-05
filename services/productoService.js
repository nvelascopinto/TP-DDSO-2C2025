import ProductoRepository from "../models/repositories/productoRepository.js"
import UsuarioService from "./usuarioService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"

class ProductoService {
  constructor(productoRepository, usuarioService) {
    this.productoRepository = productoRepository
    this.usuarioService = usuarioService
  }

  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO) {
    const producto = fromProductoDTO(productoDTO)

    return this.usuarioService.obtenerUsuario(productoDTO.vendedorID, [tipoUsuario.VENDEDOR,])
    .then((usuarioVendedor) => {
      producto.vendedor = usuarioVendedor
      return this.productoRepository.crear(producto)
    })
    .then((productoGuardado) => productoGuardado)
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
    //validarExistenciaDeProducto(producto, id)
    return this.productoRepository.findById(id)
    .then((producto) => producto)
  }

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
  obtenerTodosDeVendedor(vendedor) {
    return this.productoRepository.obtenerTodosDeVendedor(vendedor)
      .then((prodVendedor) => prodVendedor)
  }
}

export default new ProductoService(ProductoRepository, UsuarioService)