import { toItemsDTO } from "./itemsConverter.js"
import { toDireccionDTO } from "./direccionConverter.js"
import { fromItemsDTO } from "./itemsConverter.js"
import { fromDireccionDTO } from "./direccionConverter.js"
import { PedidoDTO } from "../models/DTO/pedidosDTO.js"
import { Pedido } from "../models/entities/pedido.js"
import { validarMoneda } from "../validators/monedaAnalayzer.js"
import { DomainMultipleErrors } from "../errors/domainValidationError.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { vendedorAnalyser } from "../validators/vendedorItemsAnalyzer.js"

export function toPedidoDTO(nuevoPedidoJSON) {
  return new PedidoDTO(
    toItemsDTO(nuevoPedidoJSON.items),
    nuevoPedidoJSON.moneda,
    toDireccionDTO(nuevoPedidoJSON.direccionEntrega)
  )
}

export function fromPedidoDTO(pedidoDTO, comprador, productos, numeroPedido) {
  return Promise.resolve()
    .then(() => {
      let errores = []
      errores.push(validarMoneda(pedidoDTO.moneda))
      errores.push(vendedorAnalyser(productos))
      errores = errores.filter((e) => e != null)
      if (errores.length > 0) {
        throw new DomainMultipleErrors("Se encontraron varios errores", errores)
      }
    })
    .then(() => {
      const vendedorUsername = productos[0].vendedor
      return new Pedido(
        comprador.username,
        vendedorUsername,
        fromItemsDTO(pedidoDTO.itemsDTO, productos),
        pedidoDTO.moneda,
        fromDireccionDTO(pedidoDTO.direccionEntregaDTO),
        numeroPedido
      )
    })
}
