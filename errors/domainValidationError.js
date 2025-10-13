import AppError from "./appError.js"

class DomainValidationError extends AppError {
  constructor(message, details) {
    super(message, 422, "DomainValidationError", details)
  }
}

export class EstadoInvalidoError extends DomainValidationError {
  constructor(estado) {
    super("El estado ingresado no esta dentro de las opciones ofrecidas", { estado })
  }
}

export class MonedaInvalidaError extends DomainValidationError {
  constructor(moneda) {
    super("La moneda ingresada no esta dentro de las opciones ofrecidas", { moneda })
  }
}

export class ProductosDiferentesVendedorError extends DomainValidationError {
  constructor() {
    super("Todos los productos del pedido deben pertenecer al mismo vendedor")
  }
}
