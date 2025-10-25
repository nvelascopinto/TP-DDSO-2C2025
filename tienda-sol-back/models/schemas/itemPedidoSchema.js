import mongoose from "mongoose"
import { ItemPedido } from "../entities/itemPedido.js"

export const itemPedidoSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  cantidad: {
    type: Number,
    min: 0,
    required: true
  },
  precioUnitario: {
    type: Number,
    min: 0,
    required: true
  }
})

itemPedidoSchema.loadClass(ItemPedido)
