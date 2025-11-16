import mongoose from "mongoose";
import { Tienda } from "../entities/tienda.js";

export const tiendaSchema = new mongoose.Schema(
  {
    username: {
      type:String,
      requiered: true
    },
    nombre: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    }
  },
  {
    collection: "tiendas"
  }
)

tiendaSchema.loadClass(Tienda)

export const TiendaModel = mongoose.model("Tienda", tiendaSchema)