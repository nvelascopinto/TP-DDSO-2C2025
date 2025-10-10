import mongoose from "mongoose"
import { CambioEstadoPedido } from "../entities/cambioEstadoPedido.js"

export const cambioEstadoPedidoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ["Pendiente", "Confirmado", "En_Preparacion", "Enviado", "Entregado", "Cancelado"],
    required: true
  },
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pedido",
    required: true
  },
  usuario: {
    type: String,
    ref: "Usuario",
    required: true
  },
  motivo: {
    type: String
  }
})

cambioEstadoPedidoSchema.loadClass(CambioEstadoPedido)

export const CambioEstadoPedidoModel = mongoose.model("CambioEstadoPedido", cambioEstadoPedidoSchema)
