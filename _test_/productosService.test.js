import { DatosInvalidos } from "../errors/datosInvalidosError.js"
import { ProductoDTO } from "../models/DTO/productoDTO.js"
import { Producto } from "../models/entities/producto.js"
import { Usuario } from "../models/entities/usuario.js"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js"
import UsuarioSinPermisoError from "../errors/usuarioSinPermisoError.js"

jest.mock("../models/repositories/productoRepository.js", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    crear: jest.fn()
  }
}))

jest.mock("../services/pedidoService.js", () => ({
  __esModule: true,
  default: {
    cantidadVentasProducto: jest.fn()
  }
}))

import productoService from "../services/productoService.js"
import mockProductoRepository from "../models/repositories/productoRepository.js"
import mockPedidoService from "../services/pedidoService.js"

describe("ProductosService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("crear", () => {
    const vendedor = new Usuario("pepe", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

    let productoDTO = new ProductoDTO(
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

    it("No debería crearse el producto por tener un vendedor invalido", async () => {
      productoDTO = new ProductoDTO(
        "joseMaria",
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        50,
        null,
        true
      )

      await expect(productoService.crear(productoDTO, vendedor)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockProductoRepository.crear).not.toHaveBeenCalled()
    })

    it("No debería crearse el producto por tener un vendedor que no es un vendedor", async () => {
      productoDTO = new ProductoDTO(
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

      const comprador = new Usuario("juan", "Juan Perez", "juan.perez@email.com", "+541112345678", "Vendedor")

      await expect(productoService.crear(productoDTO, comprador)).rejects.toThrow(UsuarioSinPermisoError)
      expect(mockProductoRepository.crear).not.toHaveBeenCalled()
    })
  })

  describe("obtenerTodosDeVendedor", () => {})

  describe("ordenar", () => {
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
      const ordenamiento = {
        ordenPrecio: true,
        ascendente: true
      }
      const ordenados = await productoService.ordenar(ordenamiento, productos)
      expect(ordenados).toEqual([prod2, prod1, prod3])
    })

    it("deberia ordenar los productos por precio desendentemente ", async () => {
      const ordenamiento = {
        ordenPrecio: true,
        ascendente: false
      }
      const ordenados = await productoService.ordenar(ordenamiento, productos)
      expect(ordenados).toEqual([prod3, prod1, prod2])
    })
    it("deberia ordenar los productos por precio ascendente por default  ", async () => {
      const ordenamiento = {
        ordenPrecio: true
      }
      const ordenados = await productoService.ordenar(ordenamiento, productos)
      expect(ordenados).toEqual([prod2, prod1, prod3])
    })
    it("deberia ordenar los productos por mas vendido ascendente", async () => {
      const ordenamiento = {
        ordenMasVendios: true,
        ascendente: true
      }
      mockPedidoService.cantidadVentasProducto.mockImplementation((valor) => {
        if (valor === prod1) return 7
        if (valor === prod2) return 5
        if (valor === prod3) return 6
      })
      const ordenados = await productoService.ordenar(ordenamiento, productos)
      expect(ordenados).toEqual([prod2, prod3, prod1])
    })
  })
})
