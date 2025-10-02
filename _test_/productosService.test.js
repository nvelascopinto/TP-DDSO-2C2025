import { DatosInvalidos } from "../errors/datosInvalidos"
import { ProductoDTO } from "../models/DTO/productoDTO"
import { Producto } from "../models/entities/producto"
import { ProductoService } from "../services/productoService"
import { Usuario } from "../models/entities/usuario"
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError"

const mockProductoRepository = {
  findById: jest.fn(),
  crear: jest.fn(),
}
const mockUsuarioService = {
  obtenerUsuario: jest.fn(),
}

describe("ProductosService", () => {
  let productoService

  beforeEach(() => {
    jest.clearAllMocks()
    productoService = new ProductoService(mockProductoRepository, mockUsuarioService)
  })

  describe("constructor", () => {
    it("debería inicializar con el repositorio y el service pasados por parámetro", () => {
      expect(productoService.productoRepository).toBe(mockProductoRepository)
      expect(productoService.usuarioService).toBe(mockUsuarioService)
    })
  })

  describe("crear", () => {
    const vendedor = new Usuario(
      "Juan Perez",
      "juan.perez@email.com",
      "+541112345678",
      "Vendedor",
    )

    vendedor.id = 2

    let productoDTO = new ProductoDTO(
      2,
      "auriculares",
      "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
      "Electrónica",
      15000,
      "PESO_ARG",
      50,
      null,
      true,
    )

    it("deberia crear el producto pasado", () => {
      const mockProducto = new Producto(
        vendedor,
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        50,
        null,
        true,
      )
      mockProducto.id = 1
      mockProductoRepository.crear.mockReturnValue(mockProducto)
      mockUsuarioService.obtenerUsuario.mockReturnValue(vendedor)
      expect(productoService.crear(productoDTO)).toEqual(mockProducto)
      expect(mockUsuarioService.obtenerUsuario).toHaveBeenCalledWith(2, ["Vendedor"])
      expect(mockProductoRepository.crear).toHaveBeenCalledTimes(1)
    })

    it("no deberia crear un producto con stock en 0", () => {
      productoDTO = new ProductoDTO(
        2,
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        0,
        null,
        true,
      )
      expect(() => {
        productoService.crear(productoDTO)
      }).toThrow(DatosInvalidos)
      expect(mockProductoRepository.crear)
    })

    it("no deberia crear un producto por tener moneda invalida", () => {
      productoDTO = new ProductoDTO(
        2,
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_Ur",
        50,
        null,
        true,
      )
      expect(() => {
        productoService.crear(productoDTO)
      }).toThrow(DatosInvalidos)
    })
    it("No debería crearse el producto por tener un vendedor invalido", () => {
      mockUsuarioService.obtenerUsuario.mockImplementationOnce(() => {
        throw new UsuarioInexistenteError(100)
      })
      productoDTO = new ProductoDTO(
        100,
        "auriculares",
        "Auriculares bluetooth con cancelación de ruido y 20h de batería.",
        "Electrónica",
        15000,
        "PESO_ARG",
        50,
        null,
        true,
      )

      expect(() => productoService.crear(productoDTO)).toThrow(UsuarioInexistenteError)
      expect(mockProductoRepository.crear).not.toHaveBeenCalled()
    })
  })
})
