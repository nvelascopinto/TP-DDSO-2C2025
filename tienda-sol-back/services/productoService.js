import productoRepository from "../models/repositories/productoRepository.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { ProductoInexistenteError } from "../errors/notFoundError.js"

class ProductoService {
  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO, vendedor) {
    return Promise.resolve()
      .then(() => {
        vendedor.validarRol([tipoUsuario.VENDEDOR])
        return fromProductoDTO(productoDTO, vendedor)
      }).then((producto)=>{
        return productoRepository.crear(producto)
      }).then((productoGuardado) => 
        productoGuardado
      )
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
    return productoRepository.findById(id)
      .then((producto) => {
        if (!producto) throw new ProductoInexistenteError(id)
        return producto
      })
  }

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
  obtenerTodosDeVendedor(vendedor, filtros, pagina, limite) {
    return Promise.resolve()
      .then(() => {
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

        // if (cambioProducto.precio !== undefined) producto.actualizarPrecio(cambioProducto.precio)
        // if (cambioProducto.activo !== undefined) producto.actualizarActivo(cambioProducto.activo)
        // if (cambioProducto.stock !== undefined) producto.aumentarStock(cambioProducto.aumentoStock)

        return productoRepository.update(cambioProducto, productoID)
      })
  }

 
  reducirStock(items) {
    return Promise.all(items.map((item) => this.obtenerProducto(item.producto._id)
      .then((producto) => {
        producto.reducirStock(item.cantidad)
        producto.aumentarVentas(item.cantidad)
        console.log("SE REDUCE EL STOCK " + item.cantidad)
        return productoRepository.update(producto, producto._id)
      })
    ))
  }

  aumentarStock(items) {
    return Promise.all(items.map((item) => this.obtenerProducto(item.producto._id)
      .then((producto) => {
        producto.aumentarStock(item.cantidad)
        producto.reducirVentas(item.cantidad)
        return productoRepository.update(producto, producto._id)
      })
    ))
  }
}

export default new ProductoService()
