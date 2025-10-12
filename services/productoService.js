import productoRepository from "../models/repositories/productoRepository.js"
import pedidoService from "./pedidoService.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { rolesValidator } from "../validators/usuarioValidator.js"
import { estado } from "../models/entities/estadoPedido.js"

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

  /************************** FUNCIONES AUXILIARES **************************/
  update(producto) {
    return productoRepository.update(producto).then((productoModificado) => productoModificado)
  }

  reducirStock(items) {
    return Promise.all(
      items.map((item) =>
        this.obtenerProducto(item.producto._id).then((producto) => {
          producto.reducirStock(item.cantidad)
          producto.aumentarVentas(item.cantidad)
          return this.update(producto)
        })
      )
    )
  }

  aumentarStock(items) {
    return Promise.all(
      items.map((item) =>
        this.obtenerProducto(item.producto._id).then((producto) => {
          producto.aumentarStock(item.cantidad)
          producto.reducirVentas(item.cantidad)
          return this.update(producto)
        })
      )
    )
  }
}

export default new ProductoService()
