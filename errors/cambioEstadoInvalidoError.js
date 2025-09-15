export class CambioEstadoInvalidoError extends Error {
  constructor(estadoActual, nuevoEstado) {
    super(message);
    this.name = "CambioEstadoInvalidoError"
    this.message = "El pedido no puede pasar del estado " + estadoActual + " a el estado " + nuevoEstado
}}