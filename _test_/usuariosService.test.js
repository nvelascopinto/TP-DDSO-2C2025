import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"
import { Producto } from "../models/entities/producto.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import { Pedido } from "../models/entities/pedido.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"

jest.mock("../models/repositories/usuarioRepository.js", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    crear: jest.fn()
  }
}))

import usuarioService from "../services/usuarioService.js"
import mockUsuarioRepository from "../models/repositories/usuarioRepository.js"

describe("UsuarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("crearUsuario", () => {
    it("deberia crear el usuario", async () => {
      let usuario = new UsuarioDTO("jose50", "Jose", "jose@gmail.com", "+54 11 3333 3333", "Comprador")
      let usuarioCreado = new Usuario("jose50", "Jose", "jose@gmail.com", "+54 11 3333 3333", "Comprador")

      mockUsuarioRepository.crear.mockResolvedValue(usuarioCreado) // importante

      const user = await usuarioService.crearUsuario(usuario)
      expect(user).toEqual(usuarioCreado)
      expect(mockUsuarioRepository.crear).toHaveBeenCalledTimes(1)
    })
  })

  describe("buscar", () => {
    it("debería devolver un usuario si existe en el repositorio", async () => {
      const mockUser = {
        username: "pepe",
        nombre: "Pepe",
        email: "pepeperez@gmail.com",
        telefono: "+54 11 3333 3333",
        tipoUsuario: "Vendedor"
      }
      mockUsuarioRepository.findById.mockResolvedValue(mockUser)

      const busqueda = await usuarioService.buscar("pepe")
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith("pepe")
      expect(mockUsuarioRepository.findById).toHaveBeenCalledTimes(1)
      expect(busqueda).toEqual(mockUser)
    })
    it("debería tirar UsuarioInexistenteError si el usuario no existe", async () => {
      mockUsuarioRepository.findById.mockResolvedValue(null)

      await expect(usuarioService.buscar("jajajaj")).rejects.toThrow(UsuarioInexistenteError)
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith("jajajaj")
    })
  })
})
