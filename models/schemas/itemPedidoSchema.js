import mongoose from "mongoose"
import { ItemPedido } from "../entities/itemPedido.js"

const itemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      min: 0,
      required: true,
    },  
    precioUnitario: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  {
    //timestamps: true,
    collection: "items",
  },
)

itemPedidoSchema.loadClass(ItemPedido)

export const ItemPedidoModel = mongoose.model("ItemPedido", itemPedidoSchema)
