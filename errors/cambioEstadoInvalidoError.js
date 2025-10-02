export class CambioEstadoInvalidoError extends Error {
  constructor(estadoActual, nuevoEstado) {
    super()
    this.name = "CambioEstadoInvalidoError"
    this.message =
      "El pedido no puede pasar del estado " + estadoActual + " al estado " + nuevoEstado
  }
}
