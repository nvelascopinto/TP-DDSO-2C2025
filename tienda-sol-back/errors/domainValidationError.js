import { AppError, AppMultipleErrors } from "./appError.js"

class DomainValidationError extends AppError {
  constructor(message, logInfo) {
    super(message, 422, "DomainValidationError", logInfo)
  }
}

export class DomainMultipleErrors extends AppMultipleErrors {
  constructor(message, errors) {
    super(message, 422, errors, "DomainMultipleErrors")
  }
}

export class EstadoInvalidoError extends DomainValidationError {
  constructor(estado) {
    super(
      "El estado ingresado no es válido. Por favor elija un estado permitido.", 
      "Intento de usar el ESTADO " + estado + " inválido."
    )
  }
}

export class MonedaInvalidaError extends DomainValidationError {
  constructor(moneda) {
    super(
      "La moneda ingresada no es válida. Por favor elija una moneda permitida.", 
      "Intento de usar la MONEDA " + moneda + " inválida."
    )
  }
}

export class UsuarioInvalidoError extends DomainValidationError {
  constructor(tipoUsuario) {
    super(
      "El usuario ingresado no es válido. Por favor elija un usuario permitido.",
      "Intento de usar el USUARIO" + tipoUsuario + " inválido."
    )
  }
}

export class ProductosDiferentesVendedorError extends DomainValidationError {
  constructor(idUsuario) {
    super(
      "Todos los productos del pedido deben pertenecer al mismo vendedor.",
      "Intento de crear un pedido con productos de distintos vendedores de parte del USUARIO " + idUsuario
    )
  }
}
