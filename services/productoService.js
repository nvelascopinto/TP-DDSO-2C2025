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
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        producto.validarCreador(vendedor.username)
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
  obtenerTodosDeVendedor(vendedor, filtros, pagina, limite, ordenamiento) {
    return Promise.resolve()
      .then(() => {
        rolesValidator(vendedor, [tipoUsuario.VENDEDOR])
        return productoRepository.obtenerTodosDeVendedor(vendedor.username, filtros, pagina, limite)
      })
      .then((prodVendedor) => {
        return this.ordenar(ordenamiento, prodVendedor)
      })
  }

  ordenar(ordenamiento, productos) {
    if (ordenamiento.ordenPrecio) {
      return Promise.resolve().then(() => this.ordenarPorPrecio(productos, ordenamiento.ascendente))
    }
    if (ordenamiento.ordenMasVendios) {
      return this.ordenarPorVendido(productos, ordenamiento.ascendente).then((orden) => orden)
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

  async ordenarPorVendido(productos, ascendente = true) {
    let factor = 1
    if (!ascendente) {
      factor = -1
    }
    const cantidades = await Promise.all(productos.map((p) => pedidoService.cantidadVentasProducto(p)))

    const ordenados = productos
      .map((p, i) => ({ producto: p, ventas: cantidades[i] ?? 0 }))
      .sort((x, y) => (x.ventas - y.ventas) * factor)
      .map((x) => x.producto)

    return ordenados
  }
  update(producto) {
    return productoRepository.actualizar(producto._id, producto).then((productoModificadp) => productoModificadp)
  }
}

export default new ProductoService()
