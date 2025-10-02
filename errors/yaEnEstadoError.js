export class YaEnEstadoError extends Error {
  constructor(nuevoEstado) {
    super()
    this.name = "YaEnEstadoError"
    this.message = "El pedido ya esta en estado " + nuevoEstado
  }
}
