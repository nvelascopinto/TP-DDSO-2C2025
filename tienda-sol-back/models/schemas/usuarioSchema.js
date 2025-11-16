import mongoose from "mongoose"
import { Usuario } from "../entities/usuario.js"
import { tiendaSchema } from "./tiendaSchema.js"

const usuarioSchema = new mongoose.Schema(
  {
    // USERNAME
    _id: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password : {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      trim: true
    },
    tipoUsuario: {
      type: String,
      enum: ["Comprador", "Vendedor", "Admin"]
    },
    fechaAlta: {
      type: Date,
      required: true
    }
    // ,
    // tienda : {
    //   type: tiendaSchema,
    //   required: false
    // }
  },
  {
    collection: "usuarios",
  }
)

usuarioSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = this.username
  }
  next()
})

usuarioSchema.loadClass(Usuario)

export const UsuarioModel = mongoose.model("Usuario", usuarioSchema)
