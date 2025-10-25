import { MongooseError } from "mongoose"
import { AppError } from "../errors/appError.js"
import { MongoError } from "mongodb"

export function errorHandler(error, _req, res, _next) {
  
  console.log("========================= ERROR DETECTADO =========================")
  console.log(error.stack)
  console.log("LogInfo: ", error.logInfo)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      name: error.name,
      message: error.message,
      details: error.details
    })
  } else if (error instanceof MongooseError || error instanceof MongoError) {
    return res.status(500).json({
      name: "DatabaseError",
      message: "Error en la base de datos",
      details: error.message
    })
  } else {
    return res.status(500).json({
      name: "ServerError",
      message: "Algo salió mal en el servidor",
      details: null
    })
  }
}
