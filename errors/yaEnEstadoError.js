export class YaEnEstadoError extends Error {
  constructor(nuevoEstado) {
    super();
    this.name = "YaEnEstadoError";
    this.message = "El producto ya esta en estado " + nuevoEstado;
  
}}