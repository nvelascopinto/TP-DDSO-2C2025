import { Moneda } from "../models/entities/moneda.js";
export function monedaValidator(moneda) {
  if (!Object.values(Moneda).includes(moneda)) {
    return null;
  }
  return moneda;
}
