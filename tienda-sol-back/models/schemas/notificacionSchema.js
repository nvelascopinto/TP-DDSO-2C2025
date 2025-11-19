import mongoose from "mongoose"
import { Notificacion } from "../entities/notificacion.js"

const notificacionSchema = new mongoose.Schema(
  {
    usuarioDestino: {
      type: String,
      ref: "Usuario",
      required: true
    },
    mensaje: {
      type: String,
      required: true
    },
    leida: {
      type: Boolean,
      required: true
    },
    fechaAlta: {
      type: Date,
      required: true
    },
    fechaLeida: {
      type: Date
    },
    pedido: {
      type: Number,
      required: true
    }
  },
  {
    collection: "notificaciones"
  }
)

notificacionSchema.loadClass(Notificacion)

export const NotificacionModel = mongoose.model("Notificacion", notificacionSchema)
