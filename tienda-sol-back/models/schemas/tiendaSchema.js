import mongoose from "mongoose";
import { Tienda } from "../entities/tienda.js";
export const tiendaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: false
    }
  },
  {
    collection: "tiendas"
  }
)

tiendaSchema.loadClass(Tienda)

export const TiendaModel = mongoose.model("Tienda", tiendaSchema)