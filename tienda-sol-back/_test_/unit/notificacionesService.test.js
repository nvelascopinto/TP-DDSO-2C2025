import { estados } from "../../models/entities/estadosPedido.js"
import { NotificacionInexistenteError } from "../../errors/notFoundError.js"
import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"
import { YaLeidaError } from "../../errors/conflicError.js"
import { Notificacion } from "../../models/entities/notificacion.js"

jest.mock("../../models/repositories/notificacionRepository.js", () => ({
  __esModule: true,
  default: {
    crear: jest.fn((notificacion) => Promise.resolve(notificacion)),
    getById: jest.fn(),
    update: jest.fn(),
    getNotificacionesLeidas: jest.fn(),
    getNotificacionesNoLeidas: jest.fn()
  }
}))

import notificacionService from "../../services/notificacionService.js"
import mockNotificacionRepository from "../../models/repositories/notificacionRepository.js"

const fechaFija = new Date("2025-10-07T21:30:00Z")
const mockDate = jest.spyOn(global, "Date").mockImplementation(() => fechaFija)

global.Notificacion = jest.fn()

describe("NotificacionService", () => {
  let pedidoMock
  let vendedorMock
  let compradorMock

  beforeEach(() => {
    jest.clearAllMocks()
    //notificacionService.notificarEstadoPedido = jest.fn()
    compradorMock = "pepe"
    vendedorMock = "sofia"

    pedidoMock = {
      comprador: compradorMock,
      vendedor: vendedorMock,
      numero: 1,
      _id: 1
    }
  })

  it("debe notificar si el estado es en_preparacion", async () => {
    const resultado = await notificacionService.crearSegunEstadoPedido(estados["En Preparación"].nombre, pedidoMock)

    const notificacionMock = new Notificacion(vendedorMock, "El pedido # 1 cambio a estado En Preparación",pedidoMock._id)
    notificacionMock.fechaAlta = fechaFija

    expect(resultado).toEqual(notificacionMock)
  })

  it("debe crear una notificación con el mensaje correcto y enviarla al repositorio", async () => {
  const notificacionMock = new Notificacion(compradorMock, "Un nuevo pedido fue realizado: #1",pedidoMock._id)
  notificacionMock.fechaAlta = fechaFija

  const resultado = await notificacionService.crearSegunPedido(pedidoMock)

  expect(resultado).toEqual(notificacionMock)
})

  describe("marcarComoLeida", () => {
    it("marca la notificacion correctamente como leida", async () => {
      const notificacionMock = new Notificacion(vendedorMock, "Un nuevo pedido fue realizado: #1",pedidoMock._id)
      notificacionMock._id = 1
      mockNotificacionRepository.getById.mockResolvedValue(notificacionMock)

      let notificacionMockLeido = new Notificacion(vendedorMock, "Un nuevo pedido fue realizado: #1",pedidoMock._id)
      notificacionMockLeido._id = 1
      notificacionMockLeido.leida = true
      mockNotificacionRepository.update.mockResolvedValue(notificacionMockLeido)

      const leidaNotificacion = await notificacionService.marcarComoLeida(1, vendedorMock)
      expect(leidaNotificacion.leida).toBe(true)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledWith(1)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(1)
    })

    it("no marca la notificacion como leida por no existir", async () => {
      mockNotificacionRepository.getById.mockResolvedValue(null)

      await expect(notificacionService.marcarComoLeida(1, vendedorMock)).rejects.toThrow(NotificacionInexistenteError)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledWith(1)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(0)
    })

    it(" no marca la notificacion como leida por no estar autorizado", async () => {
      const notificacionMock = new Notificacion(vendedorMock, "Un nuevo pedido fue realizado: #1",pedidoMock._id)
      notificacionMock._id = 1
      mockNotificacionRepository.getById.mockResolvedValue(notificacionMock)

      await expect(notificacionService.marcarComoLeida(1, compradorMock)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockNotificacionRepository.getById).toHaveBeenCalledWith(1)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(0)
    })

    it("no marca la notificacion como leida ya que fue leida anteriormente", async () => {
      const notificacionMock = new Notificacion(vendedorMock, "Un nuevo pedido fue realizado: #1",pedidoMock._id)
      notificacionMock._id = 1
      notificacionMock.leida = true
      mockNotificacionRepository.getById.mockResolvedValue(notificacionMock)
      await expect(notificacionService.marcarComoLeida(1, vendedorMock)).rejects.toThrow(YaLeidaError)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledWith(1)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(0)
    })
  })
})
