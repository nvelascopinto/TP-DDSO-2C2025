import ProductoRepository from "../models/repositories/productoRepository.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { validarExistenciaDeProducto } from "../validators/productoValidator.js"
import { fromProductoDTO } from "../converters/productoConverter.js"
import { rolesValidator } from "../validators/usuarioValidator.js"
import  {pedidoServiceInstance}  from "./pedidoService.js"

export class ProductoService {
  constructor(ProductoRepository, getPedidoService) {
    this.ProductoRepository = ProductoRepository
    this.pedidoService = getPedidoService
  }
  /************************** CREAR UN PRODUCTO **************************/
  crear(productoDTO, vendedor) {
    return Promise.resolve()
      .then(() => {
        const producto = fromProductoDTO(productoDTO)
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        producto.validarCreador(vendedor.username)
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

  /************************** CONSULTAR TODOS LOS PRODUCTOS DE UN VENDEDOR **************************/
  obtenerTodosDeVendedor(vendedor, filtros, pagina, limite, ordenamiento) {
    return Promise.resolve()
      .then(() => {
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        return this.ProductoRepository.obtenerTodosDeVendedor(
          vendedor.username,
          filtros,
          pagina,
          limite
        )
      })
      .then((prodVendedor) => {
        return this.ordenar(ordenamiento, prodVendedor)
      })
  }

  ordenar(ordenamiento, productos) {
    if (ordenamiento.ordenPrecio) {
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
        (this.pedidoService().cantidadVentasProducto(a) -
          this.pedidoService().cantidadVentasProducto(b)) * factor
    )
  }
}

export const productoServiceInstance = new ProductoService(
  ProductoRepository,
  () => pedidoServiceInstance,
)
