import { NotificacionService } from "../services/notificacionService.js"
import { estado } from "../models/entities/estadoPedido.js"
//import { Notificacion } from "../models/entities/notificacion"

const mockNotificacionRepository = {
  crear: jest.fn().mockResolvedValue("mock-result"),
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
      _id: 1,
    }
  })

  it("debe retornar null y no notificar si el estado es en_preparacion", () => {
    const resultado = notificacionService.crearSegunEstadoPedido(
      estado.EN_PREPARACION,
      pedidoMock,
    )

    expect(resultado).toBeNull()
  })

  it("debe crear una notificación con el mensaje correcto y enviarla al repositorio", async () => {
    const notificacionMock = {
      usuarioDestino: vendedorMock,
      mensaje: "ID NUEVO PEDIDO REALIZADO: 1",
      fechaAlta: fechaFija,
      fechaLeida: null,
      leida: false,
    }
    //Notificacion.mockReturnValue(notificacionMock)

    const resultado = await notificacionService.crearSegunPedido(pedidoMock)

    //expect(Notificacion).toHaveBeenCalledWith(pedidoMock.vendedor, 'ID NUEVO PEDIDO REALIZADO: 1')
    expect(mockNotificacionRepository.crear).toHaveBeenCalledWith(notificacionMock)
    expect(resultado).toBe("mock-result")
  })
})
