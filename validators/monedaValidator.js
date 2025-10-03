import { Moneda } from "../models/entities/moneda.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"

export function validarMoneda(moneda) {
  if (!Object.values(Moneda).includes(moneda)) {
    throw new DatosInvalidosError(
      "La moneda ingresada no esta dentro de las opciones ofrecidas",
    )
  }
}
