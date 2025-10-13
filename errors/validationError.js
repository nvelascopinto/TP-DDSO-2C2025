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

// export class MongooseValidationError extends ValidationError {
//   constructor(mongooseErrors) {
//     const details = Object.values(mongooseErrors.errors || {}).map((err) => ({
//       path: err.path,
//       message: err.message
//     }))
//     super("Los datos del modelo no son correctos", details)
//   }
// }
