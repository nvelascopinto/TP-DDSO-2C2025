import { ProductosDiferentesVendedorError } from "../errors/domainValidationError.js"

export function vendedorAnalyser(productos) {
  const vendedorUnico = productos[0].vendedor
  if (!productos.every((prod) => prod.vendedor === vendedorUnico)) {
    return new ProductosDiferentesVendedorError()
  }
  return null
}
