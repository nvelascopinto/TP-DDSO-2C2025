import { ProductoDTO } from "../models/DTO/productoDTO.js"
import { Producto } from "../models/entities/producto.js"
import { validarMoneda } from "../validators/monedaAnalayzer.js"
import { DomainMultipleErrors } from "../errors/domainValidationError.js"
export function toProductoDTO(JSONProducto) {
  return new ProductoDTO(
    // JSONProducto.vendedor,
    JSONProducto.titulo,
    JSONProducto.descripcion,
    JSONProducto.categoria,
    JSONProducto.precio,
    JSONProducto.moneda,
    JSONProducto.stock,
    JSONProducto.fotos,
    JSONProducto.activo
  )
}

export function fromProductoDTO(productoDTO, vendedor) {
  return Promise.resolve()
    .then(() => {
      let errores = [] 
        errores.push(validarMoneda(productoDTO.moneda))
        errores = errores.filter((e) => e != null)
              if (errores.length > 0) {
                throw new DomainMultipleErrors("Se encontraron varios errores", errores)
              }
      }).then(()=> {
        return new Producto(
          vendedor.username,
          productoDTO.titulo,
          productoDTO.descripcion,
          productoDTO.categoria,
          productoDTO.precio,
          productoDTO.moneda,
          productoDTO.stock,
          productoDTO.fotos,
          productoDTO.activo
        )
      })
}

export function toPaginadoResponse({ productos, total, pagina, limite }) {
  return {
    _embedded: { productos },
    pagina: {
      tamanio: limite,
      totalElementos: total,
      totalPaginas: Math.ceil(total / limite),
      numero: pagina
    }
  }
}
