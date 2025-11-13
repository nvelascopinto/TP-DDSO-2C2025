import mongoose from "mongoose"
import { DireccionEntrega } from "../entities/direccionEntrega.js"

export const direccionEntregaSchema = new mongoose.Schema({
  calle: {
    type: String,
    required: true
  },
  altura: {
    type: Number,
    required: true
  },
  piso: {
    type: Number,
    required: false,
    min: 0
  },
  departamento: {
    type: String,
    required: false
  },
  codigoPostal: {
    type: Number,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  provincia: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: true
  }
})
