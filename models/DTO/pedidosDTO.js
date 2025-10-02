export class PedidoDTO {
  constructor(compradorID, vendedorID, itemsDTO, moneda, direccionEntregaDTO) {
    this.compradorID = compradorID // se debe chequear si es comprador ?
    this.vendedorID = vendedorID
    this.itemsDTO = itemsDTO
    this.moneda = moneda
    this.direccionEntregaDTO = direccionEntregaDTO
  }
}
