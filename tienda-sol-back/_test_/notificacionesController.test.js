import request from "supertest"
import app from "../app.js"

jest.mock('../services/notificacionService.js')
import notificacionService from '../services/notificacionService.js'

describe("notificacionController", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    vendedorMock = "sofia"
  })

  it('GET /notificaciones/leidas devuelve las notificaciones leidas', async () => {
    const notificacionMock = new Notificacion(vendedorMock, "ID NUEVO PEDIDO REALIZADO: 1")
    notificacionMock._id = 1
    const notificacionMockLeida = await notificacionService.marcarComoLeida(1, vendedorMock)
    
    notificacionService.getNotificacionesLeidas.mockResolvedValue(notificacionMockLeida)

    const res = await request(app).get('/notificaciones/leidas')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(notificacionMockLeida)
    expect(notificacionService.getNotificacionesLeidas).toHaveBeenCalledWith("sofia")
  })

//   it('GET /notificaciones/noleidas devuelve las notificaciones no leídas', async () => {
//     const mockNoLeidas = [{ id: 2, mensaje: 'Nuevo pedido', leida: false }]
//     notificacionService.getNotificacionesNoLeidas.mockResolvedValue(mockNoLeidas)

//     const res = await request(app).get('/notificaciones/noleidas')

//     expect(res.status).toBe(200)
//     expect(res.body).toEqual(mockNoLeidas)
//     expect(notificacionService.getNotificacionesNoLeidas).toHaveBeenCalledWith('nico')
//   })

//   it('POST /notificaciones/:id/leida marca como leída correctamente', async () => {
//     notificacionService.marcarComoLeida.mockResolvedValue()

//     const res = await request(app).post('/notificaciones/123/leida')

//     expect(res.status).toBe(200)
//     expect(res.body).toBe('La notificacion fue leida')
//     expect(notificacionService.marcarComoLeida).toHaveBeenCalledWith('123', 'nico')
//   })
})