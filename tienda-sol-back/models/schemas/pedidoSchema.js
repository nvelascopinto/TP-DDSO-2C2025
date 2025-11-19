import mongoose from "mongoose"
import { Pedido } from "../entities/pedido.js"
import { cambioEstadoPedidoSchema } from "./cambioEstadoPedidoSchema.js"
import { direccionEntregaSchema } from "./direccionEntregaSchema.js"
import { itemPedidoSchema } from "./itemPedidoSchema.js"
import { estados } from "../entities/estadosPedido.js"
const pedidoSchema = new mongoose.Schema(
  {
    comprador: {
      type: String,
      ref: "Usuario",
      required: true
    },
    vendedor: {
      type: String,
      ref: "Usuario",
      required: true
    },
    items: {
      type: [itemPedidoSchema],
      required: true
    },
    total: {
      type: Number,
      min: 0,
      required: true
    },
    moneda: {
      type: String,
      enum: ["PESO_ARG", "DOLAR_USA", "REAL"],
      required: true
    },
    estadoNombre: {
      type: String,
      enum: ["Pendiente", "Confirmado", "En_Preparacion", "Enviado", "Entregado", "Cancelado"],
      required: true
    },
    direccionEntrega: {
      type: direccionEntregaSchema,
      required: true
    },
    historialCambioPedidos: {
      type: [cambioEstadoPedidoSchema]
    },
    fechaCreacion: {
      type: Date,
      required: true
    },
     numero: {
      type: Number,
      required: true
    }
  },
  {
    collection: "pedidos"
  }
)

pedidoSchema.virtual("estado").get(function () {
  return estados[this.estadoNombre]
})
pedidoSchema.loadClass(Pedido)

export const PedidoModel = mongoose.model("Pedido", pedidoSchema)
