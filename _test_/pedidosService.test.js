import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js"
import { PedidoStockInsuficienteError } from "../errors/pedidoStockInsuficienteError.js"
import ProductoInexistenteError from "../errors/productoInexistenteError.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import { Pedido } from "../models/entities/pedido.js"
import { Producto } from "../models/entities/producto.js"
import { Usuario } from "../models/entities/usuario.js"
import { PedidoService } from "../services/pedidoService.js"
import { estado } from "../models/entities/estadoPedido.js"
import { CambioEstadoInvalidoError } from "../errors/cambioEstadoInvalidoError.js"
import DatosInvalidosError from "../errors/datosInvalidosError.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"
import { MongooseError } from "mongoose"
import EstadoInvalidoError from "../errors/estadoInvalidoError.js"
import HistorialInexistenteError from "../errors/historialInexistenteError.js"

const mockPedidoRepository = {
  crear: jest.fn(),
  findById: jest.fn(),
  consultarHistorial: jest.fn(),
  cantidadVentasProducto: jest.fn(),
  actualizar: jest.fn()
}

const mockProductoService = {
  obtenerProducto: jest.fn(),
  update: jest.fn()
}

const mockNotificacionService = {
  crearSegunEstadoPedido: jest.fn(),
  crearSegunPedido: jest.fn()
}

const asLazy = (x) => () => x

describe("PedidosService", () => {
  let pedidoService
  let productoGetter
  beforeEach(() => {
    jest.clearAllMocks()
    productoGetter = asLazy(mockProductoService) // <- la creás una vez
    pedidoService = new PedidoService(mockPedidoRepository, productoGetter, mockNotificacionService)
  })

  describe("constructor", () => {
    it("debería inicializar con los repositorios y service pasados por parámetro", () => {
      const getter = asLazy(mockProductoService)
      expect(pedidoService.pedidoRepository).toBe(mockPedidoRepository)
      expect(pedidoService.productoService).toBe(productoGetter)
      expect(pedidoService.notificacionService).toBe(mockNotificacionService)
    })
  })
  describe("creacion de un pedido", () => {
    it("deberia crear el pedido a partir del DTO correcto", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 2,
            precioUnitario: 100
          }
        ],
        total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina",
          latitud: -34.6037,
          longitud: -58.3816
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const comprador = new Usuario("pepa", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
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
      const itemPed = new ItemPedido(item, 2, 100)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockNotificacionService.crearSegunPedido.mockResolvedValue("mock-notificacion")
      mockProductoService.obtenerProducto.mockReturnValue(item)
      mockProductoService.update.mockResolvedValue(item)
      mockPedidoRepository.crear.mockReturnValue(mockPedido)
      const result = await pedidoService.crear(pedidoDTO, comprador)

      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(1)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledWith(1)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(1)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledWith(mockPedido)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPedido)
      expect(result.total).toBe(200)
    })

    it("deberia no crear el pedido por falta de stock", async () => {
      const pedidoDTO = {
        itemsDTO: [
          {
            productoID: 1,
            cantidad: 1,
            precioUnitario: 566
          },
          {
            productoID: 2,
            cantidad: 6,
            precioUnitario: 100
          }
        ],
        total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina",
          latitud: -34.6037,
          longitud: -58.3816
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const comprador = new Usuario("pepa", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
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
      const item2 = new Producto(
        "pepe",
        "licuadora",
        "licuadora de frutas",
        "Electrónica",
        1000,
        "PESO_ARG",
        5,
        null,
        true
      )

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
      const itemPed = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item2, 4, 100)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed, itemPed2], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockProductoService.obtenerProducto.mockReturnValueOnce(item1).mockReturnValueOnce(item2)

      mockPedidoRepository.crear.mockReturnValue(mockPedido)
      await expect(() => pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(PedidoStockInsuficienteError)
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
            cantidad: 1,
            precioUnitario: 566
          },
          {
            productoID: 2,
            cantidad: 4,
            precioUnitario: 100
          }
        ],
        total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina",
          latitud: -34.6037,
          longitud: -58.3816
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const comprador = new Usuario("pepa", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

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
      const item2 = new Producto(
        "pepe",
        "licuadora",
        "licuadora de frutas",
        "Electrónica",
        100,
        "PESO_ARG",
        1,
        null,
        false
      )

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
      const itemPed = new ItemPedido(item1, 1, 566)
      const itemPed2 = new ItemPedido(item2, 4, 100)
      const mockPedido = new Pedido("pepa", "pepe", [itemPed, itemPed2], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockProductoService.obtenerProducto.mockReturnValueOnce(item1).mockReturnValueOnce(item2)
      mockPedidoRepository.crear.mockReturnValue(mockPedido)

      await expect(() => pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(PedidoInexistenteError)

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
            cantidad: 3,
            precioUnitario: 566
          }
        ],
        total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina",
          latitud: -34.6037,
          longitud: -58.3816
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
      const comprador = new Usuario("pepa", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

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
            cantidad: 1,
            precioUnitario: 566
          },
          {
            productoID: 2,
            cantidad: 4,
            precioUnitario: 100
          }
        ],
        total: 566,
        moneda: "PESO_ARG",

        direccionEntregaDTO: {
          calle: "Avenida Siempre Viva",
          altura: 742,
          piso: 1,
          departamento: "d",
          codigoPostal: 1000,
          ciudad: "Buenos Aires",
          provincia: "Buenos Aires",
          pais: "Argentina",
          latitud: -34.6037,
          longitud: -58.3816
        }
      }

      const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const otroVendedor = new Usuario("carlitos", "Carlos Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      const comprador = new Usuario("pepa", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
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
      const item2 = new Producto(
        "carlitos",
        "licuadora",
        "licuadora de frutas",
        "Electrónica",
        100,
        "PESO_ARG",
        20,
        null,
        true
      )

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
      await expect(() => pedidoService.crear(pedidoDTO, comprador)).rejects.toThrow(DatosInvalidosError)
      expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(1, 1)
      expect(mockProductoService.obtenerProducto).toHaveBeenNthCalledWith(2, 2)
      expect(mockProductoService.obtenerProducto).toHaveBeenCalledTimes(2)
      expect(mockNotificacionService.crearSegunPedido).toHaveBeenCalledTimes(0)
    })
  })

  describe("consultar", () => {
    const vendedor = new Usuario("juanchi", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const comprador = new Usuario("juana", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
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
    const itemPed = new ItemPedido(item, 1, 566)

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
      const compradorNoValido = new Usuario(
        "pepita",
        "Juan Perez",
        "juan.perez@email.com",
        "+541112345678",
        "Comprador"
      )
      const mockPedido = new Pedido("juana", "juanchi", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 2
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      await expect(pedidoService.consultar(2, compradorNoValido)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(2)
    })

    it(" deberia devolver el pedido ya que es un usuario valido el administrador", async () => {
      const adminValido = new Usuario("pepita", "Juan Perez", "juan.perez@email.com", "+541112345678", "Admin")
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
    const vendedor = new Usuario("juancito", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const comprador = new Usuario("juancho", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

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
    const itemPed = new ItemPedido(item, 1, 566)

    it("deberia cambiar de estado de pendiente a enviado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedidoRepository.findById.mockResolvedValue(mockPedido)

      const cambioEstadoJSON = {
        motivo: "enviado",
        estado: "ENVIADO"
      }
      cambioEstadoJSON.usuario = vendedor

      const mockPedidoEnviado = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)

      mockPedidoEnviado._id = 1
      mockPedidoEnviado.estado = estado.ENVIADO
      mockPedidoRepository.actualizar.mockResolvedValue(mockPedidoEnviado)
      mockNotificacionService.crearSegunEstadoPedido.mockResolvedValue({
        mensaje: "El pedido 1 cambio a estado ENVIADO"
      })

      const result = await pedidoService.cambioEstado(cambioEstadoJSON, 1)

      expect(result).toBe("El pedido 1 cambio a estado ENVIADO")
      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(1)
    })

    it("NO deberia cambiar de estado de Enviado a Cancelado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estado.ENVIADO

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const cambioEstadoJSON = {
        motivo: "disgusto",
        estado: "CANCELADO"
      }

      cambioEstadoJSON.usuario = vendedor

      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(CambioEstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado de Cancelado a Enviado", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estado.CANCELADO

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      const cambioEstadoJSON = {
        motivo: "envio",
        estado: "ENVIADO"
      }

      cambioEstadoJSON.usuario = vendedor

      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(CambioEstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado por no existir el pedido ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1

      mockPedidoRepository.findById.mockResolvedValue(null)

      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "ENVIADO"
      }
      cambioEstadoJSON.usuario = vendedor
      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(PedidoInexistenteError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado a ENVIADO por ser pedido por un COMPRADOR ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estado.ENVIADO

      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "ENVIADO"
      }
      cambioEstadoJSON.usuario = comprador
      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(0)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado a ENVIADO por ser pedido por un COMPRADOR ", async () => {
      const desconocido = new Usuario("pepita", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1
      mockPedido.estado = estado.ENVIADO

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)

      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "ENVIADO"
      }
      cambioEstadoJSON.usuario = desconocido
      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })

    it("NO deberia cambiar de estado por ser inválido ", async () => {
      const mockPedido = new Pedido("juancho", "juancito", [itemPed], "PESO_ARG", direEntrega)
      mockPedido._id = 1

      mockPedidoRepository.findById.mockResolvedValue(mockPedido)
      mockPedidoRepository.actualizar.mockRejectedValue(new EstadoInvalidoError("CAMBIAR"))
      const cambioEstadoJSON = {
        motivo: "enviar",
        estado: "CAMBIADO"
      }
      cambioEstadoJSON.usuario = comprador
      await expect(pedidoService.cambioEstado(cambioEstadoJSON, 1)).rejects.toThrow(EstadoInvalidoError)

      expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(0)
      expect(mockPedidoRepository.actualizar).toHaveBeenCalledTimes(0)
      expect(mockNotificacionService.crearSegunEstadoPedido).toHaveBeenCalledTimes(0)
    })
  })

  describe("consultarHistorial", () => {
    const comprador = new Usuario("juancito", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
    const vendedor = new Usuario("juancho", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    const admin = new Usuario("pepita", "Juan Perez", "juan.perez@email.com", "+541112345678", "Admin")
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

    it("no deberia devolver el historial  por no existir ", async () => {
      mockPedidoRepository.consultarHistorial.mockResolvedValue([])
      await expect(pedidoService.consultarHistorial("juancito", comprador)).rejects.toThrow(HistorialInexistenteError)
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
      const otroVendedor = new Usuario("jose", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
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
