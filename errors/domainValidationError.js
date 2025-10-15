import AppError, { AppMultipleErrors } from "./appError.js"

class DomainValidationError extends AppError {
  constructor(message, details) {
    super(message, 422, "DomainValidationError", details)
  }
}

export class DomainMultipleErrors extends AppMultipleErrors {
  constructor(message, errors) {
    super(message, 422, errors, "DomainMultipleErrors")
  }
}

export class EstadoInvalidoError extends DomainValidationError {
  constructor(estado) {
    super("El tipo de estado ingresado no esta dentro de las opciones validas", { estado })
  }
}

export class MonedaInvalidaError extends DomainValidationError {
  constructor(moneda) {
    super("La tipo de moneda ingresada no esta dentro de las opciones validas", { moneda })
  }
}

export class UsuarioInvalidoError extends DomainValidationError {
  constructor(usuario) {
    super("El tipo de usuario ingresado no esta dentro de las opciones validas", {usuario})
  }
}

export class ProductosDiferentesVendedorError extends DomainValidationError {
  constructor() {
    super("Todos los productos del pedido deben pertenecer al mismo vendedor")
  }
}
