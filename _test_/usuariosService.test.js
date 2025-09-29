import { UsuarioService } from "../services/usuarioService.js";
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js";
import { UsuarioDTO } from "../models/DTO/usuarioDTO.js";
import { DatosInvalidos } from "../errors/datosInvalidos.js";
import { Usuario } from "../models/entities/usuario.js";

const mockUsuarioRepository = {
  findById: jest.fn(),
  crear: jest.fn(),
};

describe("UsuarioService", () => {
  let usuarioService;

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioService = new UsuarioService(mockUsuarioRepository);
  });

  describe("constructor", () => {
    it("debería inicializar con el repositorio pasado por parámetro", () => {
      expect(usuarioService.usuarioRepository).toBe(mockUsuarioRepository);
    });
  });

  describe("obtenerUsuario", () => {
    it("debería retornar un usuario existente si tiene un rol permitido", () => {
      const mockUser = { id: 1, nombre: "Pepe", tipoUsuario: "Admin" };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesPermitidos = ["Comprador", "Vendedor", "Admin"];
      const result = usuarioService.obtenerUsuario(1, rolesPermitidos);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it("deberia lanzar UsuarioInexistenteError si el usuario no existe", () => {
      mockUsuarioRepository.findById.mockReturnValue(null);

      expect(() => usuarioService.obtenerUsuario(1, ["Admin"])).toThrow(
        UsuarioInexistenteError,
      );

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(1);
    });

    it("debería lanzar UsuarioSinPermiso si el rol del usuario está en la lista restringida", () => {
      const mockUser = { id: 2, nombre: "Juan", tipoUsuario: "Vendedor" };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesRestringidos = ["Comprador"];

      expect(() => usuarioService.obtenerUsuario(2, rolesRestringidos)).toThrow(
        UsuarioSinPermiso,
      );

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(2);
    });

    it("debería permitir acceso a un COMPRADOR si no está en los roles restringidos", () => {
      const mockUser = { id: 3, nombre: "Sofi", tipoUsuario: "Comprador" };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesPermitidos = ["Comprador"];
      const result = usuarioService.obtenerUsuario(3, rolesPermitidos);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockUser);
    });
  });

  describe("crearUsuario", () => {
    it("no deberia crearlo ya que se ingresaro un tipo de Usuario invalido", () => {
      let usuario = new UsuarioDTO(
        "Jose",
        "jose@gmail.com",
        "+54 11 3333 3333",
        "Productor",
      );

      expect(() => {
        usuarioService.crearUsuario(usuario);
      }).toThrow(DatosInvalidos);
    });

    it("deneria crear el usuario", () => {
      let usuario = new UsuarioDTO(
        "Jose",
        "jose@gmail.com",
        "+54 11 3333 3333",
        "Admin",
      );
      let usuarioCreado = new Usuario(
        "Jose",
        "jose@gmail.com",
        "+54 11 3333 3333",
        "Admin",
      );
      usuarioCreado.id = 1;

      mockUsuarioRepository.crear.mockReturnValue(usuarioCreado);
      expect(usuarioService.crearUsuario(usuario)).toEqual(usuarioCreado);
      expect(mockUsuarioRepository.crear).toHaveBeenCalledTimes(1);
    });
  });

  describe("buscar", () => {
    it("debería devolver un usuario si existe en el repositorio", () => {
      const mockUser = {
        id: 4,
        nombre: "Pepe",
        email: "pepeperez@gmail.com",
        telefono: "+54 11 3333 3333",
        tipoUsuario: "Vendedor",
      };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const busqueda = usuarioService.buscar(4);
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(4);
      expect(busqueda).toEqual(mockUser);
    });
    it("debería tirar UsuarioInexistenteError si el usuario no existe", () => {
      mockUsuarioRepository.findById.mockReturnValue(null);

      expect(() => usuarioService.buscar(999)).toThrow(UsuarioInexistenteError);
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});
