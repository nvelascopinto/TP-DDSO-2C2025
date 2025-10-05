import mongoose from "mongoose"
import { Usuario } from "../entities/usuario.js"

const usuarioSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: String,
    //   required: true,
    // },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    tipoUsuario: {
      type: String,
      enum: ["Comprador", "Vendedor", "Admin"],
    },
    fechaAlta: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "usuarios",
  },
)

usuarioSchema.loadClass(Usuario)

export const UsuarioModel = mongoose.model("Usuario", usuarioSchema)
