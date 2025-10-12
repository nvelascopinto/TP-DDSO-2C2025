import productoRepository from "../models/repositories/productoRepository.js"
import pedidoService from "./pedidoService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { rolesValidator } from "../validators/usuarioValidator.js"

class ProductoService {
  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO, vendedor) {
    return Promise.resolve()
      .then(() => {
        const producto = fromProductoDTO(productoDTO)
        vendedor.validarRol([tipoUsuario.VENDEDOR])
        producto.asignarVendedor(vendedor.username)
        // producto.validarCreador(vendedor.username)
        console.log(producto)
        return productoRepository.crear(producto)
      })
      .then((productoGuardado) => productoGuardado)
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
    return productoRepository.findById(id).then((producto) => {
      validarExistenciaDeProducto(producto, id)
      return producto
    })
  }

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
  obtenerTodosDeVendedor(vendedor, filtros, pagina, limite) {
    return Promise.resolve().then(() => {
      vendedor.validarRol([tipoUsuario.VENDEDOR])
      return productoRepository.obtenerTodosDeVendedor(vendedor.username, filtros, pagina, limite)
    })
  }

  update(producto) {
    return productoRepository.actualizar(producto._id, producto).then((productoModificado) => productoModificado)
  }

  actualizarCantidadVentas(items) {
    return Promise.all(
      items.map((item) => {
        item.producto.cantVentas = item.producto.cantVentas + item.cantidad
        return this.update(item.producto)
      })
    )
  }

  /************************** ACTUALIZAR LOS CAMPOS DE UN PRODUCTO **************************/
  actualizar(vendedor, productoID, cambioProducto) {
    return Promise.resolve()
      .then(() => {
        vendedor.validarRol([tipoUsuario.VENDEDOR])
        return this.obtenerProducto(productoID)
      })
      .then((producto) => {
        producto.validarCreador(vendedor.username)

        if (cambioProducto.precio !== undefined) producto.actualizarPrecio(cambioProducto.precio)
        if (cambioProducto.activo !== undefined) producto.actualizarActivo(cambioProducto.activo)
        if (cambioProducto.aumentoStock !== undefined) producto.aumentarStock(cambioProducto.aumentoStock)

        return this.update(producto)
      })
      .then((productoActualizado) => productoActualizado)
  }
}

export default new ProductoService()
