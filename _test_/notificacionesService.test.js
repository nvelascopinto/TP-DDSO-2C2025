import { notificacionService } from "../services/notificacionService.js"
import { estado } from "../models/entities/estadoPedido.js"
//import { Notificacion } from "../models/entities/notificacion"

const mockNotificacionRepository = {
    crear: jest.fn().mockResolvedValue('mock-result')
}
const mockUsuarioService = {
    obtenerUsuario: jest.fn(),

}

global.Notificacion = jest.fn()

describe('NotificacionService', () => {
    let notificacionService
    let pedidoMock

    beforeEach(() => {
    jest.clearAllMocks()
    notificacionService = new NotificacionService(mockNotificacionRepository)

    notificacionService.notificarEstadoPedido = jest.fn()

    pedidoMock = {
        comprador: { compradorMock },
        vendedor: { vendedorMock },
        _id: 1
    }
    compradorMock={}
    vendedorMock={}
    })

    it('debe notificar al comprador cuando el estado es CONFIRMADO', () => {
        notificador.crearSegunEstadoPedido(estado.CONFIRMADO, pedidoMock)

        expect(notificacionService.notificarEstadoPedido).toHaveBeenCalledWith(
            estado.CONFIRMADO, pedidoMock.comprador, pedidoMock._id)
    })

    it('debe notificar al comprador cuando el estado es ENVIADO', () => {
        notificador.crearSegunEstadoPedido(estado.ENVIADO, pedidoMock)

        expect(notificador.notificarEstadoPedido).toHaveBeenCalledWith( estado.ENVIADO, pedidoMock.comprador,pedidoMock._id)
    })

    it('debe notificar al vendedor cuando el estado es CANCELADO', () => {
        notificador.crearSegunEstadoPedido(estado.CANCELADO, pedidoMock)

        expect(notificador.notificarEstadoPedido).toHaveBeenCalledWith(estado.CANCELADO, pedidoMock.vendedor,pedidoMock._id
    )
    })

    it('debe retornar null y no notificar si el estado es en_preparacion', () => {
    const resultado = notificador.crearSegunEstadoPedido(estado.EN_PREPARACION, pedidoMock)

    expect(resultado).toBeNull()
    expect(notificador.notificarEstadoPedido).not.toHaveBeenCalled()
    })


    it('debe crear una notificación con el mensaje correcto y enviarla al repositorio', async () => {
    const notificacionMock = { msg: 'mock' }
    Notificacion.mockReturnValue(notificacionMock)

    const resultado = await notificacionService.crearSegunPedido(pedido)

    expect(Notificacion).toHaveBeenCalledWith(pedido.vendedor, 'ID NUEVO PEDIDO REALIZADO: 1')
    expect(mockRepository.crear).toHaveBeenCalledWith(notificacionMock)
    expect(resultado).toBe('mock-result')
    })
    
    it('debe crear una notificación con el mensaje correcto y enviarla al repositorio', async () => {

    const destinatarioMock = { vendedorMock}
    const idPedidoMock = 'pedido123'

    const notificacionMock = { msg: 'notiFake' }
    Notificacion.mockReturnValue(notificacionMock)

    const result = await service.notificarEstadoPedido(estado.CONFIRMADO, destinatarioMock, idPedidoMock)

    expect(Notificacion).toHaveBeenCalledWith(destinatarioMock,'El pedido 1 cambio a estado CONFIRMADO')
    expect(mockRepository.crear).toHaveBeenCalledWith(notificacionMock)
    expect(result).toBe('mock-result')
    })
})

