import { ZodError } from "zod"
import { MongooseError } from "mongoose"
import AppError from "../errors/appError.js"
import { MongoError } from "mongodb"

export function errorHandler(error, _req, res, _next) {
  console.log(error.message)

  if (error instanceof ZodError) {
    return res.status(400).json({
      name: "DatosInvalidos",
      message: "Datos ingresados invalidos",
      details: error.issues
    })
  } else if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      name: error.name,
      message: error.message,
      details: error.details
    })
  } else if (error instanceof MongooseError) {
    return res.status(400).json({
      name: "DatabaseError",
      message: "Error en la base de datos, datos invalidos",
      details: error.message
    })
  } else {
    if (error instanceof MongoError) {
      return res.status(400).json({
        name: "DatabaseError",
        message: "Error en la base de datos, datos invalidos",
        details: error.message
      })
    } else {
      return res.status(500).json({
        name: "ServerError",
        message: "Algo salio mal en el Servidor",
        details: null
      })
    }
  }
}
