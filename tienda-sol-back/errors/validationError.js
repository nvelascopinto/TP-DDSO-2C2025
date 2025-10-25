import { AppError } from "./appError.js"

export class ValidationError extends AppError {
  constructor(message, logInfo, details) {
    super(message, 400, "ValidationError", logInfo, details)
  }
}

export class ZodValidationError extends ValidationError {
  constructor(zodError) {
    super(
      "Los datos ingresados no son correctos",
      zodError.issues, 
      zodError.issues.map(i => i.message)
    )
  }
}
