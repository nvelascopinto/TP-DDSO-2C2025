export class PedidoDTO {
  constructor(itemsDTO, moneda, direccionEntregaDTO) {
    this.itemsDTO = itemsDTO
    this.moneda = moneda
    this.direccionEntregaDTO = direccionEntregaDTO
  }
}
