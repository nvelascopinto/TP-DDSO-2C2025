import ProductoRepository from "../models/repositories/productoRepository.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { rolesValidator } from "../validators/usuarioValidator.js"
import { pedidoServiceInstance } from "./pedidoService.js"

export class ProductoService {
  constructor(ProductoRepository, pedidoServiceInstance) {
    this.ProductoRepository = ProductoRepository
    this.pedidoService = pedidoServiceInstance
  }
  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO, vendedor) {
    return Promise.resolve()
      .then(() => {
        const producto = fromProductoDTO(productoDTO)
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        producto.validarCreador(vendedor._id)
        console.log(producto)
        return this.ProductoRepository.crear(producto)
      })
      .then((productoGuardado) => productoGuardado)
  }

  /************************** CONSULTAR UN PRODUCTO **************************/
  obtenerProducto(id) {
    return this.ProductoRepository.findById(id).then((producto) => {
      validarExistenciaDeProducto(producto, id)
      return producto
    })
  }
  //      const ordenamiento = {ordenVentas : ordenVentas , ordenMasVendios :ordenMasVendios, ascendente : ascendente}

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
  obtenerTodosDeVendedor(vendedor, filtros, pagina, limite, ordenamiento) {
    return Promise.resolve()
      .then(() => {
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        return this.ProductoRepository.obtenerTodosDeVendedor(
          vendedor._id,
          filtros,
          pagina,
          limite,
        )
      })
      .then((prodVendedor) => {
        return this.ordenar(ordenamiento, prodVendedor)
      })
  }

  ordenar(ordenamiento, productos) {
    if (ordenamiento.ordenVentas) {
      return this.ordenarPorPrecio(productos, ordenamiento.ascendente)
    }
    if (ordenamiento.ordenMasVendios) {
      return this.ordenarPorVendido(productos, ordenamiento.ascendente)
    }
    return productos
  }

  ordenarPorPrecio(productos, ascendente = true) {
    let factor = 1
    if (!ascendente) {
      factor = -1
    }
    return productos.sort((a, b) => (a.precio - b.precio) * factor)
  }

  ordenarPorVendido(productos, ascendente = true) {
    let factor = 1
    if (!ascendente) {
      factor = -1
    }
    return productos.sort(
      (a, b) =>
        (this.pedidoService.cantidadVentasProducto(b) -
          this.pedidoService.cantidadVentasProducto(a)) *
        factor,
    )
  }
}

export const productoServiceInstance = new ProductoService(
  ProductoRepository,
  pedidoServiceInstance,
)
