export class HistorialInexistenteError extends Error {
  constructor(IDUsuario) {
    super(message);
    this.name = "HistorialInexistenteError";
    this.message = "No existe historial de pedidos para el usuario: " + IDUsuario
}}