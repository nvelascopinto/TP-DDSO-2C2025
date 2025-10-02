import AppError from "./appError.js"

class ProductoInexistenteError extends AppError {
  constructor(id) {
    super(`No existe un producto con ese ID`, 404, "ProductoInexistente", { id })
  }
}

export default ProductoInexistenteError
