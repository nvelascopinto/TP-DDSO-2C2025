import { ProductoDTO } from "../../models/DTO/productoDTO.js"
import { Producto } from "../../models/entities/producto.js"
import { Usuario } from "../../models/entities/usuario.js"
import { UsuarioSinPermisoError } from "../../errors/authorizationError.js"

jest.mock("../../models/repositories/productoRepository.js", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    crear: jest.fn(),
    obtenerTodosDeVendedor: jest.fn()
  }
}))

jest.mock("../../services/pedidoService.js", () => ({
  __esModule: true,
  default: {
    cantidadVentasProducto: jest.fn()
  }
}))

import productoService from "../../services/productoService.js"
import mockProductoRepository from "../../models/repositories/productoRepository.js"
import mockPedidoService from "../../services/pedidoService.js"

describe("ProductosService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("crear", () => {
    const vendedor = new Usuario("pepe", "Pepe123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    let productoDTO = new ProductoDTO(
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      15000,
      "PESO_ARG",
      50,
      null,
      true
    )

    it("deberia crear el producto pasado", async () => {
      const mockProducto = new Producto(
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
      mockProducto._id = 1
      mockProductoRepository.crear.mockResolvedValue(mockProducto)
      const prodNuevo = await productoService.crear(productoDTO, vendedor)
      expect(prodNuevo).toEqual(mockProducto)
      expect(mockProductoRepository.crear).toHaveBeenCalledTimes(1)
    })

    // it("No debería crearse el producto por tener un vendedor invalido", async () => {
    //   productoDTO = new ProductoDTO(
    //     "auriculares",
    //     "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
    //     "Electrónica",
    //     15000,
    //     "PESO_ARG",
    //     50,
    //     null,
    //     true
    //   )

    //   await expect(productoService.crear(productoDTO, vendedor)).rejects.toThrow(UsuarioSinPermisoError)
    //   expect(mockProductoRepository.crear).not.toHaveBeenCalled()
    // })

    it("No debería crearse el producto por tener un vendedor que no es un vendedor", async () => {
      productoDTO = new ProductoDTO(
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        50,
        null,
        true
      )

      const comprador = new Usuario("juan", "Juan Perez", "juan.perez@email.com", "+541112345678", "Comprador")

      await expect(productoService.crear(productoDTO, comprador)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockProductoRepository.crear).not.toHaveBeenCalled()
    })
  })

  describe("obtenerTodosDeVendedor", () => {
    const vendedor = new Usuario("pepe", "Pepe123", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")
    const prod1 = new Producto(
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
    prod1._id = 1
    const prod2 = new Producto(
      "pepe",
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      150,
      "PESO_ARG",
      50,
      null,
      true
    )
    prod2._id = 2

    const prod3 = new Producto(
      "pepe",
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      3000000,
      "PESO_ARG",
      50,
      null,
      true
    )
    prod3._id = 3

    const productos = [prod1, prod2, prod3]

    it("deberia ordenar los productos por precio ascendentemente ", async () => {
      mockProductoRepository.obtenerTodosDeVendedor.mockResolvedValue([prod2, prod1, prod3])
      const filtros = { orden: "precioAsc" }
      const resultado = await productoService.obtenerTodosDeVendedor(vendedor, filtros, 1, 10)
      expect(resultado).toEqual([prod2, prod1, prod3])
      expect(mockProductoRepository.obtenerTodosDeVendedor).toHaveBeenCalledWith("pepe", filtros, 1, 10)
    })

    it("deberia ordenar los productos por precio desendentemente ", async () => {
      mockProductoRepository.obtenerTodosDeVendedor.mockResolvedValue([prod3, prod1, prod2])
      const filtros = { orden: "precioDesc" }
      const resultado = await productoService.obtenerTodosDeVendedor(vendedor, filtros, 1, 10)
      expect(resultado).toEqual([prod3, prod1, prod2])
    })
    it("deberia ordenar los productos por precio ascendente por default  ", async () => {
      const filtros = {} // sin orden explícito
      mockProductoRepository.obtenerTodosDeVendedor.mockResolvedValue([prod2, prod1, prod3])

      const resultado = await productoService.obtenerTodosDeVendedor(vendedor, filtros, 1, 10)
      expect(resultado).toEqual([prod2, prod1, prod3])
      expect(mockProductoRepository.obtenerTodosDeVendedor).toHaveBeenCalledWith("pepe", filtros, 1, 10)
    })
    it("deberia ordenar los productos por mas vendido ascendente", async () => {
      mockProductoRepository.obtenerTodosDeVendedor.mockResolvedValue([prod1, prod3, prod2])
      const filtros = { orden: "masVendido" }
      const resultado = await productoService.obtenerTodosDeVendedor(vendedor, filtros, 1, 10)
      expect(resultado).toEqual([prod1, prod3, prod2])
    })
  })
})
