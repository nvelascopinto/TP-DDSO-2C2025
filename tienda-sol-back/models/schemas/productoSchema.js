import mongoose from "mongoose"
import { Producto } from "../entities/producto.js"

export const productoSchema = new mongoose.Schema(
  {
    vendedor: {
      type: String,
      ref: "Usuario",
      required: true
    },
    titulo: {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      min: 0,
      required: true
    },
    moneda: {
      type: String,
      enum: ["PESO_ARG", "DOLAR_USA", "REAL"],
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    fotos: {
      type: [String],
      required: false
    },
    activo: {
      type: Boolean,
      required: true
    },
    cantVentas: {
      type: Number
    }
  },
  {
    collection: "productos"
  }
)

productoSchema.loadClass(Producto)

export const ProductoModel = mongoose.model("Producto", productoSchema)
