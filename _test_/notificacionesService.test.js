import { NotificacionService } from "../services/notificacionService.js"
import { estado } from "../models/entities/estadoPedido.js"
//import { Notificacion } from "../models/entities/notificacion"

const mockNotificacionRepository = {
    crear: jest.fn().mockResolvedValue('mock-result')
}

const fechaFija = new Date('2025-10-07T21:30:00Z');
const mockDate = jest.spyOn(global, 'Date').mockImplementation(() => fechaFija);

global.Notificacion = jest.fn()

describe('NotificacionService', () => {
    let notificacionService
    let pedidoMock


    beforeEach(() => {
    jest.clearAllMocks()
    notificacionService = new NotificacionService(mockNotificacionRepository)
    spyNotificarEstadoPedido = jest.spyOn(notificacionService, 'notificarEstadoPedido')
    //notificacionService.notificarEstadoPedido = jest.fn()
    compradorMock =  "pepe"
    vendedorMock =  "sofia"

    pedidoMock = {
        comprador: compradorMock ,
        vendedor: vendedorMock ,
        _id: 1
    }
    spyNotificarEstadoPedido.mockClear()
    })

    it('debe notificar al comprador cuando el estado es CONFIRMADO', () => {
        notificacionService.crearSegunEstadoPedido(estado.CONFIRMADO, pedidoMock)

        expect(notificacionService.notificarEstadoPedido).toHaveBeenCalledWith(
            estado.CONFIRMADO, pedidoMock.comprador, pedidoMock._id)
    })

    it('debe notificar al comprador cuando el estado es ENVIADO', () => {
        notificacionService.crearSegunEstadoPedido(estado.ENVIADO, pedidoMock)

        expect(spyNotificarEstadoPedido).toHaveBeenCalledWith( estado.ENVIADO, pedidoMock.comprador,pedidoMock._id)
    })

    it('debe notificar al vendedor cuando el estado es CANCELADO', () => {
        notificacionService.crearSegunEstadoPedido(estado.CANCELADO, pedidoMock)

        expect(spyNotificarEstadoPedido).toHaveBeenCalledWith(estado.CANCELADO, pedidoMock.vendedor,pedidoMock._id
    )
    })

    it('debe retornar null y no notificar si el estado es en_preparacion', () => {
    const resultado = notificacionService.crearSegunEstadoPedido(estado.EN_PREPARACION, pedidoMock)

    expect(resultado).toBeNull()
    expect(spyNotificarEstadoPedido).not.toHaveBeenCalled()
    })


    it('debe crear una notificación con el mensaje correcto y enviarla al repositorio', async () => {
    const notificacionMock = { usuarioDestino : vendedorMock, mensaje : "ID NUEVO PEDIDO REALIZADO: 1", fechaAlta : fechaFija , fechaLeida : null, leida : false  }
    //Notificacion.mockReturnValue(notificacionMock)

    const resultado = await notificacionService.crearSegunPedido(pedidoMock)

    //expect(Notificacion).toHaveBeenCalledWith(pedidoMock.vendedor, 'ID NUEVO PEDIDO REALIZADO: 1')
    expect(mockNotificacionRepository.crear).toHaveBeenCalledWith(notificacionMock)
    expect(resultado).toBe('mock-result')
    })
})

