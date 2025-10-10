import { NotificacionService } from "../services/notificacionService.js"
import { estado } from "../models/entities/estadoPedido.js"
import NotificacionInexistenteError from "../errors/notificacionInexistenteError.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"
import YaLeidaError from "../errors/yaLeidaError.js"
import { Notificacion } from "../models/entities/notificacion.js"
//import { Notificacion } from "../models/entities/notificacion"

const mockNotificacionRepository = {
  crear: jest.fn().mockResolvedValue("mock-result"),
  getById: jest.fn(),
  update: jest.fn()
}

const fechaFija = new Date("2025-10-07T21:30:00Z")
const mockDate = jest.spyOn(global, "Date").mockImplementation(() => fechaFija)

global.Notificacion = jest.fn()

describe("NotificacionService", () => {
  let notificacionService
  let pedidoMock
  let vendedorMock
  let compradorMock

  beforeEach(() => {
    jest.clearAllMocks()
    notificacionService = new NotificacionService(mockNotificacionRepository)
    //notificacionService.notificarEstadoPedido = jest.fn()
    compradorMock = "pepe"
    vendedorMock = "sofia"

    pedidoMock = {
      comprador: compradorMock,
      vendedor: vendedorMock,
      _id: 1
    }
  })

  it("debe retornar null y no notificar si el estado es en_preparacion", () => {
    const resultado = notificacionService.crearSegunEstadoPedido(estado.EN_PREPARACION, pedidoMock)

    expect(resultado).toBeNull()
  })

  it("debe crear una notificación con el mensaje correcto y enviarla al repositorio", async () => {
    const notificacionMock = {
      usuarioDestino: vendedorMock,
      mensaje: "ID NUEVO PEDIDO REALIZADO: 1",
      fechaAlta: fechaFija,
      fechaLeida: null,
      leida: false
    }
    //Notificacion.mockReturnValue(notificacionMock)

    const resultado = await notificacionService.crearSegunPedido(pedidoMock)

    //expect(Notificacion).toHaveBeenCalledWith(pedidoMock.vendedor, 'ID NUEVO PEDIDO REALIZADO: 1')
    expect(resultado).toBe("mock-result")
  })

  describe("marcarComoLeida", () => {
    it("marca la notificacion correctamente como leida", async () => {
      const notificacionMock = new Notificacion(vendedorMock, "ID NUEVO PEDIDO REALIZADO: 1")
      notificacionMock._id = 1
      mockNotificacionRepository.getById.mockResolvedValue(notificacionMock)

      let notificacionMockLeido = new Notificacion(vendedorMock, "ID NUEVO PEDIDO REALIZADO: 1")
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
      const notificacionMock = new Notificacion(vendedorMock, "ID NUEVO PEDIDO REALIZADO: 1")
      notificacionMock._id = 1
      mockNotificacionRepository.getById.mockResolvedValue(notificacionMock)

      await expect(notificacionService.marcarComoLeida(1, compradorMock)).rejects.toThrow(UsuarioSinPermisoError)

      expect(mockNotificacionRepository.getById).toHaveBeenCalledWith(1)
      expect(mockNotificacionRepository.getById).toHaveBeenCalledTimes(1)
      expect(mockNotificacionRepository.update).toHaveBeenCalledTimes(0)
    })

    it("no marca la notificacion como leida ya que fue leida anteriormente", async () => {
      const notificacionMock = new Notificacion(vendedorMock, "ID NUEVO PEDIDO REALIZADO: 1")
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
