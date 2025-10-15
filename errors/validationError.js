import AppError from "./appError.js"

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400, "ValidationError", details)
  }
}

// export class ZodValidationError extends ValidationError {
//   constructor(zodErrors) {
//     super("Los datos ingresados no son correctos", zodErrors)
//   }
// }
