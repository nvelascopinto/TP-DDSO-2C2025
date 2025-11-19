import { DireccionEntrega } from "../../models/entities/direccionEntrega.js"
import { ItemPedido } from "../../models/entities/itemPedido.js"
import { Pedido } from "../../models/entities/pedido.js"
import { Producto } from "../../models/entities/producto.js"
import { Usuario } from "../../models/entities/usuario.js"
import { estados } from "../../models/entities/estadosPedido.js"
import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"
import { DomainMultipleErrors, EstadoInvalidoError } from "../../errors/domainValidationError.js"
import { PedidoInexistenteError, ProductoInexistenteError } from "../../errors/notFoundError.js"
import { ProductoStockInsuficienteError, CambioEstadoInvalidoError, ProductoInactivoError } from "../../errors/conflicError.js"

jest.mock("../../models/repositories/pedidoRepository.js", () => ({
  __esModule: true,
  default: {
    crear: jest.fn(),
    findById: jest.fn(),
    consultarHistorial: jest.fn(),
    cantidadVentasProducto: jest.fn(),
    update: jest.fn(),
    getNumeroPedido: jest.fn().mockResolvedValue(1)
  }
}))

jest.mock("../../services/productoService.js", () => ({
  __esModule: true,
  default: {
    obtenerProducto: jest.fn(),
    update: jest.fn(),
    actualizarCantidadVentas: jest.fn(),
    reducirStock: jest.fn()
  }
}))

jest.mock("../../services/notificacionService.js", () => ({
  __esModule: true,
  default: {
    crearSegunEstadoPedido: jest.fn(),
    crearSegunPedido: jest.fn()
  }
}))

import pedidoService from "../../services/pedidoService.js"
import mockPedidoRepository from "../../models/repositories/pedidoRepository.js"
import mockProductoService from "../../services/productoService.js"
import mockNotificacionService from "../../services/notificacionService.js"

describe("PedidosService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("creacion de un pedido", () => {
    it("deberia crear el pedido a partir del DTO correcto", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 2
            //precioUnitario: 100
          }
        ],
        // total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina"
        }
      }

      const comprador = new Usuario("pepa", "Pepa123","Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
      const item = new Producto(
        "pepe",
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        50,
        null,
        true
      )
      item._id = 1
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
        -58.3816
      )
      const itemPed = new ItemPedido(item, 2, 15000)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed], "PESO_ARG", direEntrega)
      mockPedido.calcularTotal()
      mockPedido._id = 1
      mockNotificacionService.crearSegunPedido.mockResolvedValue("mock-notificacion")
      
      mockProductoService.obtenerProducto.mockReturnValue(item)
      mockProductoService.update.mockResolvedValue(item)
      mockPedidoRepository.crear.mockReturnValue(mockPedido)
      const result = await pedidoService.crear(pedidoDTO, comprador)

      expect(mockProductoService.reducirStock).toHaveBeenCalledTimes(1);
      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(1)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledWith(1)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(1)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledWith(mockPedido)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPedido)
      expect(result.total).toBe(30000)
    })

    it("deberia no crear el pedido por falta de stock", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 100000
          },
          {
            productoID: 2,
            cantidad: 6
          }
        ],
        moneda: "PESO_ARG",
        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina"
        }
      }

      const comprador = new Usuario("pepa", "Pepa123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
      const item1 = new Producto(
        "pepe",
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        200,
        null,
        true
      )
      const item2 = new Producto("pepe", "licuadora", "licuadora de frutas", "Electrónica", 1000, "PESO_ARG", 5, null, true)

      item1._id = 1
      item2._id = 2
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
        -58.3816
      )
      const itemPed = new ItemPedido(item1, 1, 100000)
      const itemPed2 = new ItemPedido(item2, 4, 1000)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed, itemPed2], "PESO_ARG", direEntrega, 1)
      mockPedido._id = 1
      mockProductoService.obtenerProducto.mockReturnValueOnce(item1).mockReturnValueOnce(item2)

      mockPedidoRepository.crear.mockReturnValue(mockPedido)
      await expect(pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(ProductoStockInsuficienteError)
      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(1, 1)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(2, 2)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(2)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(0)
    })

    it("deberia no crear un pedido por falta de stock por producto inactivo", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 1
          },
          {
            productoID: 2,
            cantidad: 4
          }
        ],
        moneda: "PESO_ARG",
        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina"
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const comprador = new Usuario("pepa", "Pepa123","Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

      const item1 = new Producto(
        "pepe",
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        200,
        null,
        true
      )
      const item2 = new Producto("pepe", "licuadora", "licuadora de frutas", "Electrónica", 100, "PESO_ARG", 1, null, false)

      item1._id = 1
      item1._id = 2
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
        -58.3816
      )
      const itemPed = new ItemPedido(item1, 1, 15000)
      const itemPed2 = new ItemPedido(item2, 4, 100)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed, itemPed2], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockProductoService.obtenerProducto.mockReturnValueOnce(item1).mockReturnValueOnce(item2)
      mockPedidoRepository.crear.mockReturnValue(mockPedido)

      await expect(pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(ProductoInactivoError)

      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(1, 1)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(2, 2)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(2)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(0)
    })

    it("deberia no crear el pedido por no existencia del producto", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 3
          }
        ],
        moneda: "PESO_ARG",
        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina"
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
      const comprador = new Usuario("pepa", "Pepa123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

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
        -58.3816
      )
      mockProductoService.obtenerProducto.mockRejectedValue(new ProductoInexistenteError(1))
      await expect(() => pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(ProductoInexistenteError)
      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0)
    })

    it("deberia no crear el pedido por tener productos de diferente vendedor", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 1
          },
          {
            productoID: 2,
            cantidad: 4
          }
        ],
        moneda: "PESO_ARG",
        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina"
        }
      }

      const comprador = new Usuario("pepa", "Pepa123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

      const item1 = new Producto(
        "pepe",
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        200,
        null,
        true
      )
      const item2 = new Producto("carlitos", "licuadora", "licuadora de frutas", "Electrónica", 100, "PESO_ARG", 20, null, true)

      item1._id = 1
      item1._id = 2
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
        -58.3816
      )
      mockProductoService.obtenerProducto.mockReturnValueOnce(item1).mockReturnValueOnce(item2)
      await expect(() => pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(DomainMultipleErrors)
      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(1, 1)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(2, 2)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(2)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(0)
    })
  })

  describe("consultar", () => {
    const vendedor = new Usuario("juanchi", "Juanchi123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const comprador = new Usuario("juana", "Juana123","Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
    const item = new Producto(
      "juanchi",
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      15000,
      "PESO_ARG",
      50,
      null,
      true
    )
    item._id = 1
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
      -58.3816
    )
    const itemPed = new ItemPedido(item, 1, 15000)

    it("deberia devolver el pedido solicitado", async () => {
      const mockPedido = new Pedido("juana", "juanchi", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 3
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const pedidoConsultado = await pedidoService.consultar(3, vendedor)
      expect(pedidoConsultado).toEqual(mockPedido)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(3)
    })

    it(" no deberia devolver el pedido ya que no existe", async () => {
      mockPedidoRepository.findById.mockResolvedValue(null)
      await expect(pedidoService.consultar(2, comprador)).rejects.toThrow(PedidoInexistenteError)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(2)
    })

    it(" no deberia devolver el pedido ya que no es un usuario valido", async () => {
      const compradorNoValido = new Usuario("pepita", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
      const mockPedido = new Pedido("juana", "juanchi", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 2
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      await expect(pedidoService.consultar(2, compradorNoValido)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(2)
    })

    it(" deberia devolver el pedido ya que es un usuario valido el administrador", async () => {
      const adminValido = new Usuario("pepita", "Pepita123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Admin")
      const mockPedido = new Pedido("juana", "juanchi", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 2
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const pedido = await pedidoService.consultar(2, adminValido)
      expect(pedido).toBe(mockPedido)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(2)
    })
  })

  describe("cambioEstado", () => {
    const vendedor = new Usuario("juancito", "Juancito123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const comprador = new Usuario("juancho", "Juancho123","Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

    const item = new Producto(
      "juancito",
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      15000,
      "PESO_ARG",
      50,
      null,
      true
    )
    item._id = 1
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
      -58.3816
    )
    const itemPed = new ItemPedido(item, 1, 15000)

    it("deberia cambiar de estado de pendiente a enviado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estadoNombre = "Pendiente"
      mockPedido.historialCambioPedidos = []  // ← IMPORTANTE
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)

      const cambioEstadoJSON = {
        motivo: "enviado",
        estado: "Enviado"
      }

      const mockPedidoEnviado = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedidoEnviado._id = 1
      mockPedidoEnviado.estadoNombre = "Enviado"
      mockPedidoEnviado.estado = estados["Enviado"]

      mockPedidoEnviado.historialCambioPedidos = [
        { motivo: "enviado", estado: "Enviado" }
      ]

      mockPedidoRepository.update.mockResolvedValue(mockPedidoEnviado)
      mockNotificacionService.crearSegunEstadoPedido.mockResolvedValue({
        mensaje: "El pedido 1 cambio a estado ENVIADO"
      })

      const result = await pedidoService.cambioEstado(cambioEstadoJSON.estado, vendedor, cambioEstadoJSON.motivo, 1)

      expect(result.estadoNombre).toBe("Enviado")
      expect(result.historialCambioPedidos).toHaveLength(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(1)
    })

    it("NO deberia cambiar de estado de Enviado a Cancelado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estados["Enviado"]

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const cambioEstadoJSON = {
        motivo: "disgusto",
        estado: "Cancelado"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, vendedor, cambioEstadoJSON.motivo, 1)).rejects.toThrow(CambioEstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado de Cancelado a Enviado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estados["Cancelado"]

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const cambioEstadoJSON = {
        motivo: "envio",
        estado: "Enviado"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, vendedor, cambioEstadoJSON.motivo, 1)).rejects.toThrow(CambioEstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado por no existir el pedido ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1

      mockPedidoRepository.findById.mockResolvedValue(null)

      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "Enviado"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, vendedor, cambioEstadoJSON.motivo, 1)).rejects.toThrow(PedidoInexistenteError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado a ENVIADO por ser pedido por un COMPRADOR ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estados["Enviado"]
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      
      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "Enviado"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, comprador, cambioEstadoJSON.motivo, 1)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado a ENVIADO por ser pedido por un COMPRADOR ", async () => {
      const desconocido = new Usuario("pepita", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estados["Enviado"]

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)

      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "Enviado"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, comprador, cambioEstadoJSON.motivo, 1)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado por ser inválido ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      mockPedidoRepository.update.mockRejectedValue(new EstadoInvalidoError("CAMBIAR"))
      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "CAMBIADO"
      }

      await expect(pedidoService.cambioEstado(cambioEstadoJSON.estado, vendedor, cambioEstadoJSON.motivo, 1)).rejects.toThrow(EstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.update).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })
  })

  describe("consultarHistorial", () => {
    const comprador = new Usuario("juancito", "Juancito123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
    const vendedor = new Usuario("juancho", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const admin = new Usuario("pepita", "Pepita123","Juan Perez", "juan.perez@email.com", "+541112345678", "Admin")
    const item1 = new Producto(
      "juancho",
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      15000,
      "PESO_ARG",
      200,
      null,
      true
    )
    item1._id = 1
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
      -58.3816
    )
    it("deberia devolver el historial dado un usuario valido y un historial existente", async () => {
      const itemPed1 = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item1, 4, 100)
      const ped1 = new Pedido("juancito", "juancho", [itemPed1], "PESO_ARG", direEntrega)
      ped1._id = 1
      const ped2 = new Pedido("juancito", "juancho", [itemPed2], "PESO_ARG", direEntrega)
      ped2._id = 2
      mockPedidoRepository.consultarHistorial.mockResolvedValue([ped1, ped2])
      const historial = await pedidoService.consultarHistorial("juancito", comprador)
      expect(historial).toEqual([ped1, ped2])
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledWith("juancito")
    })

    it("deberia devolver el historial vacio por no haber hecho pedidos ", async () => {
      mockPedidoRepository.consultarHistorial.mockResolvedValue([])
      const historial = await pedidoService.consultarHistorial("juancito", comprador)
      expect(historial).toEqual([])
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledWith("juancito")
    })

    it("no deberia devolver el historial  por ser pedido por un usuario invalido ", async () => {
      const itemPed1 = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item1, 4, 100)
      const ped1 = new Pedido("juancito", "juancho", [itemPed1], "PESO_ARG", direEntrega)
      ped1._id = 1
      const ped2 = new Pedido("juancito", "juancho", [itemPed2], "PESO_ARG", direEntrega)
      ped2._id = 2
      const otroVendedor = new Usuario("jose", "Jose123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
      mockPedidoRepository.consultarHistorial.mockResolvedValue([ped1, ped2])
      await expect(pedidoService.consultarHistorial("juancito", otroVendedor)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledWith("juancito")
    })

    it("deberia devolver el historial  por ser pedido por un ADMIN ", async () => {
      const itemPed1 = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item1, 4, 100)
      const ped1 = new Pedido("juancito", "juancho", [itemPed1], "PESO_ARG", direEntrega)
      ped1._id = 1
      const ped2 = new Pedido("juancito", "juancho", [itemPed2], "PESO_ARG", direEntrega)
      ped2._id = 2
      mockPedidoRepository.consultarHistorial.mockResolvedValue([ped1, ped2])
      const historial = await pedidoService.consultarHistorial("juancito", admin)
      expect(historial).toEqual([ped1, ped2])
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledWith("juancito")
    })
  })
})
