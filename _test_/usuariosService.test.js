import { UsuarioService } from "../services/usuarioService.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import { UsuarioDTO } from "../models/DTO/usuarioDTO.js"
import { Usuario } from "../models/entities/usuario.js"
import { Producto } from "../models/entities/producto.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import { Pedido } from "../models/entities/pedido.js"

const mockUsuarioRepository = {
  findById: jest.fn(),
  crear: jest.fn(),
}

const mockPedidoService = {
  consultarHistorial: jest.fn(),
}

describe("UsuarioService", () => {
  let usuarioService

  beforeEach(() => {
    jest.clearAllMocks()
    usuarioService = new UsuarioService(mockUsuarioRepository, mockPedidoService)
  })

  describe("constructor", () => {
    it("debería inicializar con el repositorio pasado por parámetro", () => {
      expect(usuarioService.UsuarioRepository).toBe(mockUsuarioRepository)
      expect(usuarioService.PedidoService).toBe(mockPedidoService)
    })
  })

  describe("crearUsuario", () => {
    it("deberia crear el usuario", async () => {
      let usuario = new UsuarioDTO(
        "jose50",
        "Jose",
        "jose@gmail.com",
        "+54 11 3333 3333",
        "Comprador",
      )
      let usuarioCreado = new Usuario(
        "jose50",
        "Jose",
        "jose@gmail.com",
        "+54 11 3333 3333",
        "Comprador",
      )

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
        tipoUsuario: "Vendedor",
      }
      mockUsuarioRepository.findById.mockResolvedValue(mockUser)

      const busqueda = await usuarioService.buscar("pepe")
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith("pepe")
      expect(mockUsuarioRepository.findById).toHaveBeenCalledTimes(1)
      expect(busqueda).toEqual(mockUser)
    })
    it("debería tirar UsuarioInexistenteError si el usuario no existe", async () => {
      mockUsuarioRepository.findById.mockResolvedValue(null)

      await expect(usuarioService.buscar("jajajaj")).rejects.toThrow(
        UsuarioInexistenteError,
      )
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith("jajajaj")
    })
  })

  describe("consultarHistorialUsuario", () => {
    const comprador = new Usuario(
      "juancito",
      "Juan Perez",
      "juan.perez@email.com",
      "+541112345678",
      "Comprador",
    )

    it("debería obtener el historial de un usuario si realizó más de un pedido", async () => {
      const vendedor = new Usuario(
        "juancho",
        "Juan Perez",
        "juan.perez@email.com",
        "+541112345678",
        "Vendedor",
      )
      const item1 = new Producto(
        vendedor,
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        200,
        null,
        true,
      )
      item1.id = 1
      const direEntrega = new DireccionEntrega(
        "Avenida Siempre Viva",
        742,
        1,
        "d",
        1000,
        "Buenos Aires",
        "Buenos Aires",
        "Argentina",
        -34.6037,
        -58.3816,
      )
      const itemPed1 = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item1, 4, 100)
      const ped1 = new Pedido(comprador, vendedor, [itemPed1], "PESO_ARG", direEntrega)
      ped1.id = 1
      const ped2 = new Pedido(comprador, vendedor, [itemPed2], "PESO_ARG", direEntrega)
      ped2.id = 2

      mockPedidoService.consultarHistorial.mockReturnValue([ped1, ped2])
      const historial = await mockPedidoService.consultarHistorial("juancito")
      expect(historial).toEqual([ped1, ped2])
      expect(mockPedidoService.consultarHistorial).toHaveBeenCalledTimes(1)
      expect(mockPedidoService.consultarHistorial).toHaveBeenCalledWith("juancito")
    })
  })
})
