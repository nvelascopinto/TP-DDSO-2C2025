import { DatosInvalidos } from "../errors/datosInvalidos.js"
import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js"
import { PedidoStockInsuficiente } from "../errors/pedidoStockInsuficiente.js"
import { ProductoInexistente } from "../errors/productoInexistente.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js"
import { HistorialInexistenteError } from "../errors/historialInexistenteError.js"
import { direccionEntregaDTO } from "../models/DTO/direccionEntregaDTO.js"
import { itemDTO } from "../models/DTO/itemDTO.js"
import { PedidoDTO } from "../models/DTO/pedidosDTO.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"
import { ItemPedido } from "../models/entities/itemPedido.js"
import { Pedido } from "../models/entities/pedido.js"
import { Producto } from "../models/entities/producto.js"
import { Usuario } from "../models/entities/usuario.js"
import { PedidoService } from "../service/pedidoService.js"
import { estado } from "../models/entities/estadoPedido.js"
import { tipoUsuario } from "../models/entities/tipoUsuario.js"
import { CambioEstadoInvalidoError } from "../errors/cambioEstadoInvalidoError.js"

const mockPedidoRepository = {
    crear: jest.fn(),
    findById: jest.fn(),
    consultarHistorial: jest.fn()
};

const mockProductoRepository = {
    findById: jest.fn()
};
const mockUsuarioService = {
    obtenerUsuario: jest.fn()
};
describe('PedidosService', () => {
    let pedidoService;

    beforeEach(() => {
        jest.clearAllMocks();
        pedidoService = new PedidoService(mockPedidoRepository, mockUsuarioService, mockProductoRepository);
    });

    describe('constructor', () => {
        it('debería inicializar con los repositorios y service pasados por parámetro', () => {
            expect(pedidoService.pedidoRepository).toBe(mockPedidoRepository);
            expect(pedidoService.productoRepository).toBe(mockProductoRepository);
            expect(pedidoService.usuarioService).toBe(mockUsuarioService);
        });
    })
    describe('crearPedido', () => {
        it('deberia crear el pedido a partir del DTO correcto', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };

            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );

            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2
            vendedor.id = 1
            const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
            item.id = 1
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
            );
            const itemPed = new ItemPedido(item, 2, 100)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById.mockReturnValue(item)
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockReturnValueOnce(vendedor)

            const result = pedidoService.crear(pedidoDTO)

            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(1);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
            expect(mockProductoRepository.findById).toHaveBeenCalledWith(1);
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(1);

            expect(result).toEqual(mockPedido)
            expect(result.total).toBe(200)
        })

// probar que se puedba uno y no otro 


        it('deberia no crear el pedido por falta de stock', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };

            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );

            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2
            vendedor.id = 1
            const item1 = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 200, null, true)
            const item2 = new Producto(vendedor, "licuadora", "licuadora de frutas", "Electrónica", 1000, "PESO_ARG", 5, null, true)

            item1.id = 1
            item1.id = 2
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
            );
            const itemPed = new ItemPedido(item1, 1, 566)
            const itemPed2 = new ItemPedido(item2, 4, 100)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed, itemPed2], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById
                .mockReturnValueOnce(item1)
                .mockReturnValueOnce(item2)
               
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockReturnValueOnce(vendedor)
               
            
            expect(()=>{pedidoService.crear(pedidoDTO)}).toThrow(PedidoStockInsuficiente)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
          
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(1, 1);
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(2, 2);
           
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(2);


        })

        it('deberia crear un pedido pero no los dos por falta de stock por producto inactivo', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };

            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );

            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2
            vendedor.id = 1
            const item1 = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 200, null, true)
            const item2 = new Producto(vendedor, "licuadora", "licuadora de frutas", "Electrónica", 100, "PESO_ARG", 1, null, false)

            item1.id = 1
            item1.id = 2
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
            );
            const itemPed = new ItemPedido(item1, 1, 566)
            const itemPed2 = new ItemPedido(item2, 4, 100)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed, itemPed2], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById
                .mockReturnValueOnce(item1)
                .mockReturnValueOnce(item2)
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockReturnValueOnce(vendedor)

            expect(() => pedidoService.crear(pedidoDTO)).toThrow(PedidoStockInsuficiente)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(1, 1);
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(2, 2);
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(2);


        })
        it('deberia no crear el pedido por no existencia del vendedor', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };


            const vendedor = null
            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2

            const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 10, null, true)
            item.id = 1
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
            );
            const itemPed = new ItemPedido(item, 1, 566)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById.mockReturnValue(item)
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockImplementationOnce(() => {
                    throw new UsuarioInexistenteError(1)
                })

            expect(() => pedidoService.crear(pedidoDTO)).toThrow(UsuarioInexistenteError)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(0);



        })

        it('deberia no crear el pedido por no existencia del comprador', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };
            const comprador = null
            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );


            vendedor.id = 1
            const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 10, null, true)
            item.id = 1
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
            );
            const itemPed = new ItemPedido(item, 1, 566)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById.mockReturnValue(item)
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockImplementationOnce(() => {             // 2ª llamada lanza error
                    throw new UsuarioInexistenteError(2)
                })

            expect(() => pedidoService.crear(pedidoDTO)).toThrow(UsuarioInexistenteError)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(0);




        })

        it('deberia no crear el pedido por falta de producto', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
                itemsDTO: [
                    {
                        productoID: 1,
                        cantidad: 1,
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
            };

            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );

            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2
            vendedor.id = 1
            const item = null


            mockProductoRepository.findById.mockReturnValue(item)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockReturnValueOnce(vendedor)

            expect(() => pedidoService.crear(pedidoDTO)).toThrow(ProductoInexistente)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
            expect(mockProductoRepository.findById).toHaveBeenCalledWith(1);
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(1);


        })

        it('deberia no crear el pedido por tener productos de diferente vendedor', () => {

            const pedidoDTO = {
                compradorID: 2,
                vendedorID: 1,
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
            };

            const vendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );

            const otroVendedor = new Usuario(
                "Carlos Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );


            const comprador = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Comprador"
            );
            comprador.id = 2
            vendedor.id = 1
            otroVendedor.id = 2
            const item1 = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 200, null, true)
            const item2 = new Producto(otroVendedor, "licuadora", "licuadora de frutas", "Electrónica", 100, "PESO_ARG", 1, null, true)

            item1.id = 1
            item1.id = 2
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
            );
            const itemPed = new ItemPedido(item1, 1, 566)
            const itemPed2 = new ItemPedido(item2, 4, 100)
            const mockPedido = new Pedido(comprador, vendedor, [itemPed, itemPed2], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockProductoRepository.findById
                .mockReturnValueOnce(item1)
                .mockReturnValueOnce(item2)
            mockPedidoRepository.crear.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario
                .mockReturnValueOnce(comprador)
                .mockReturnValueOnce(vendedor)

            expect(() => pedidoService.crear(pedidoDTO)).toThrow(DatosInvalidos)
            expect(mockPedidoRepository.crear).toHaveBeenCalledTimes(0);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(2);
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(1, 2, ['Comprador'])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenNthCalledWith(2, 1, ['Vendedor'])
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(1, 1);
            expect(mockProductoRepository.findById).toHaveBeenNthCalledWith(2, 2);
            expect(mockProductoRepository.findById).toHaveBeenCalledTimes(2);


        })

    })


    describe('cancelarPedido', () => {

        const vendedor = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Vendedor"
        );

        const comprador = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Comprador"
        );
        comprador.id = 2
        vendedor.id = 1
        const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
        item.id = 1
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
        );
        const itemPed = new ItemPedido(item, 1, 566)



        it('deberia cancelar el pedido por ser el vendedor quien lo hace', () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1

            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)

            const cambioEstadoJSON = { idUsuario: 1, motivo: "disgusto" }
            const result = pedidoService.cancelar(cambioEstadoJSON, 1)
            expect(result.historialCambioPedidos.length).toBe(1)
            expect(result.estado).toBe("Cancelado")
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(1, ["Comprador", "Vendedor", "Admin"])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)

        })

        it('deberia cancelar el pedido por ser el admin quien lo hace', () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            const admin = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Admin"
            );
            admin.id = 3
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(admin)

            const cambioEstadoJSON = { idUsuario: 3, motivo: "disgusto" }
            const result = pedidoService.cancelar(cambioEstadoJSON, 1)
            expect(result.historialCambioPedidos.length).toBe(1)
            expect(result.estado).toBe("Cancelado")
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(3, ["Comprador", "Vendedor", "Admin"])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)

        })

        it('no deberia cancelarse por no ser otro vendedor el que lo realiza ', () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            const otroVendedor = new Usuario(
                "Juan Perez",
                "juan.perez@email.com",
                "+541112345678",
                "Vendedor"
            );
            otroVendedor.id = 4
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(otroVendedor)

            const cambioEstadoJSON = { idUsuario: 4, motivo: "disgusto" }

            expect(() => pedidoService.cancelar(cambioEstadoJSON, 1)).toThrow(UsuarioSinPermiso)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(4, ["Comprador", "Vendedor", "Admin"])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
        })

        it('no deberia cancelarse por no existir el usuario que hace la solicitud de cancelacion ', () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockImplementationOnce(() => {
                throw new UsuarioInexistenteError(3)
            })

            const cambioEstadoJSON = { idUsuario: 3, motivo: "disgusto" }

            expect(() => pedidoService.cancelar(cambioEstadoJSON, 1)).toThrow(UsuarioInexistenteError)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(3, ["Comprador", "Vendedor", "Admin"])
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
        })
    })

    describe('consultar', () => {

        const vendedor = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Vendedor"
        );

        const comprador = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Comprador"
        );
        comprador.id = 2
        vendedor.id = 1
        const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
        item.id = 1
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
        );
        const itemPed = new ItemPedido(item, 1, 566)


        it('deberia devolver el pedido solicitado', () => {

            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 3
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            expect(pedidoService.consultar(3)).toEqual(mockPedido)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(3)

        })

        it(' no deberia devolver el pedido ya que no existe', () => {


            mockPedidoRepository.findById.mockReturnValue(null)
            expect(() => { pedidoService.consultar(2) }).toThrow(PedidoInexistenteError)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(2)

        })



    })

    describe('verHistorialUsuario', () => {
        const comprador = new Usuario("Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")
        comprador.id = 1

        it('no debería obtener el historial de un usuario si nunca realizó un pedido', () => {
            mockPedidoRepository.consultarHistorial.mockReturnValue([])

            expect(() => pedidoService.consultarHistorial(1)).toThrow(HistorialInexistenteError)

            expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledWith(1)
        })

        it('debería obtener el historial de un usuario si realizó más de un pedido', () => {
            const vendedor = new Usuario("Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
            vendedor.id = 2
            const item1 = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 200, null, true)
            item1.id = 1
            const direEntrega = new DireccionEntrega("Avenida Siempre Viva", 742, 1, "d", 1000, "Buenos Aires", "Buenos Aires", "Argentina", -34.6037, -58.3816);
            const itemPed1 = new ItemPedido(item1, 1, 566)
            const itemPed2 = new ItemPedido(item1, 4, 100)
            const ped1 = new Pedido(comprador, vendedor, [itemPed1], "PESO_ARG", direEntrega)
            ped1.id = 1
            const ped2 = new Pedido(comprador, vendedor, [itemPed2], "PESO_ARG", direEntrega)
            ped2.id = 2

            mockPedidoRepository.consultarHistorial.mockReturnValue([ped1, ped2])

            expect(mockPedidoRepository.consultarHistorial(1)).toEqual([ped1, ped2])
            expect(mockPedidoRepository.consultarHistorial).toHaveBeenCalledTimes(1)

        })
    })

    describe('marcarEnviado', () => {

        const vendedor = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Vendedor"
        )
        vendedor.id = 1

        const comprador = new Usuario(
            "Pepe Perez",
            "pepe.perez@email.com",
            "+541112345678",
            "Comprador"
        )
        comprador.id = 2

        it('debería marcar un pedido como enviado', () => {

            const prod = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
            prod.id = 1

            const itemPed = new ItemPedido(prod, 3, 100)
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
            );
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 123

            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockReturnValue(mockPedido)

            pedidoService.marcarEnviado(1, 123)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(1, [tipoUsuario.VENDEDOR])
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(123)

        })
        it('debería tirar PedidoInexistenteError si el pedido no existe', () => {
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockImplementationOnce(null)

            expect(() => pedidoService.marcarEnviado(1, 999)).toThrow(PedidoInexistenteError)
        })
        it('debería tirar CambioEstadoInvalidoError si intenta enviar desde un estado no válido', () => {
            const prod = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
            prod.id = 1

            const itemPed = new ItemPedido(prod, 3, 100)
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
            );
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 123
            mockPedido.estado = "Cancelado"
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockReturnValue(mockPedido)

            expect(() => pedidoService.marcarEnviado(1, 123)).toThrow(CambioEstadoInvalidoError)
        })
    })

    describe("esValidoCambioEstado", () => {
        it("es valido pasar de pendiente a confirmado ", () => {
            expect(pedidoService.esValidoCambioEstado(estado.CANCELADO, estado.PENDIENTE)).toBe(true)
        })

        it("es valido pasar de confirmado a entregado ", () => {
            expect(pedidoService.esValidoCambioEstado(estado.ENTREGADO, estado.CONFIRMADO)).toBe(true)
        })

        it("es valido pasar de en preparacion a enviado ", () => {
            expect(pedidoService.esValidoCambioEstado(estado.ENVIADO, estado.EN_PREPARACION)).toBe(true)
        })

        it("NO es valido pasar de cancelado a entregado ", () => {
            expect(() => { pedidoService.esValidoCambioEstado(estado.ENTREGADO, estado.CANCELADO) }).toThrow(CambioEstadoInvalidoError)
        })

        it("NO es valido pasar de entregado a cancelado ", () => {
            expect(() => { pedidoService.esValidoCambioEstado(estado.CANCELADO, estado.ENTREGADO) }).toThrow(CambioEstadoInvalidoError)
        })

        it("NO es valido pasar de enviado a cancelado ", () => {
            expect(() => { pedidoService.esValidoCambioEstado(estado.CANCELADO, estado.ENVIADO) }).toThrow(CambioEstadoInvalidoError)
        })
    })


    describe("cambioEstado", () => {
             const vendedor = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Vendedor"
        );

        const comprador = new Usuario(
            "Juan Perez",
            "juan.perez@email.com",
            "+541112345678",
            "Comprador"
        );
        comprador.id = 2
        vendedor.id = 1
        const item = new Producto(vendedor, "auriculares", "Auriculares bluetooth con cancelación de ruido y 20h de batería.", "Electrónica", 15000, "PESO_ARG", 50, null, true)
        item.id = 1
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
        );
        const itemPed = new ItemPedido(item, 1, 566)

        it("deberia cambiar de estado de pendiente a enviado", () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1

            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)

            const cambioEstadoJSON = { idUsuario: 1, motivo: "enviado", estado :"ENVIADO" }
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            const result = pedidoService.cambioEstado(cambioEstadoJSON, 1)
            expect(result.estado).toBe(estado.ENVIADO)
            expect(result.historialCambioPedidos.length).toBe(1)
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)

        }) 

        it("NO deberia cambiar de estado de Enviado a Cancelado", () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockPedido.estado = estado.ENVIADO

            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)

            const cambioEstadoJSON = { idUsuario: 1, motivo: "disgusto", estado :"CANCELADO" }
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            
            expect(()=>{pedidoService.cambioEstado(cambioEstadoJSON, 1)}).toThrow(CambioEstadoInvalidoError)
            
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)

        }) 

        it("NO deberia cambiar de estado de Cancelado a Enviado", () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockPedido.estado = estado.CANCELADO

            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)

            const cambioEstadoJSON = { idUsuario: 1, motivo: "enviar", estado :"ENVIADO" }
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            
            expect(()=>{pedidoService.cambioEstado(cambioEstadoJSON, 1)}).toThrow(CambioEstadoInvalidoError)
            
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledWith(1)

        }) 

        it("NO deberia cambiar de estado por tener usuario de la peticion inexistente", () => {
            const mockPedido = new Pedido(comprador, vendedor, [itemPed], "PESO_ARG", direEntrega)
            mockPedido.id = 1
            mockPedido.estado = estado.CANCELADO

            mockPedidoRepository.findById.mockReturnValue(mockPedido)
            mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)

            const cambioEstadoJSON = { idUsuario: 2, motivo: "enviar", estado :"ENVIADO" }
            mockUsuarioService.obtenerUsuario.mockImplementationOnce(()=>{
                throw new UsuarioInexistenteError(2)
            })
            
            
            expect(()=>{pedidoService.cambioEstado(cambioEstadoJSON, 1)}).toThrow(UsuarioInexistenteError)
            
            expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledTimes(1)
            expect(mockPedidoRepository.findById).toHaveBeenCalledTimes(0)
            

        }) 

    })
// PROBAR POR SI NO EXISTE EL PEDIDO 

})