import { Moneda } from "../models/entities/moneda.js"
import { MonedaInvalidaError } from "../errors/domainValidationError.js"
export function validarMoneda(moneda) {
  if (!Object.values(Moneda).includes(moneda)) {
    return new MonedaInvalidaError(moneda)
  }
  return null
}
