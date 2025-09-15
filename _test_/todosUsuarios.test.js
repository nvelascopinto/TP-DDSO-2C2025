// _tests_/todosUsuarios.test.js
import { UsuriosService } from '../service/usuariosService.js'
import { UsuarioInexistenteError } from '../errors/usuarioInexistenteError.js'
import { UsuarioSinPermiso } from '../errors/usuarioSinPermisos.js'

// 1. Setup y Mocking
const mockUsuarioRepository = {
  findById: jest.fn()
};

describe('UsuariosService', () => {
  let usuariosService;

  // 2. Configuración de Tests
  beforeEach(() => {
    jest.clearAllMocks();
    usuariosService = new UsuriosService(mockUsuarioRepository);
  });

  // 3. Tests del Constructor
  describe('constructor', () => {
    it('debería inicializar con el repositorio pasado por parámetro', () => {
      expect(usuariosService.usuarioRepository).toBe(mockUsuarioRepository);
    });
  });

  // 4. Tests de Métodos - obtenerUsuario
  describe('obtenerUsuario', () => {
    it('debería retornar un usuario existente si tiene un rol permitido', () => {
      const mockUser = { id: 1, nombre: 'Pepe', tipoUsuario: 'ADMIN' };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesPermitidos = ['COMPRADOR', 'VENDEDOR', 'ADMIN'];
      const result = usuariosService.obtenerUsuario(1, rolesPermitidos);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('deberia lanzar UsuarioInexistenteError si el usuario no existe', () => {
      mockUsuarioRepository.findById.mockReturnValue(null);

      expect(() => usuariosService.obtenerUsuario(1, ['ADMIN']))
        .toThrow(UsuarioInexistenteError);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(1);
    });

    it('debería lanzar UsuarioSinPermiso si el rol del usuario está en la lista restringida', () => {
      const mockUser = { id: 2, nombre: 'Juan', tipoUsuario: 'VENDEDOR' };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesRestringidos = ['COMPRADOR'];

      expect(() => usuariosService.obtenerUsuario(2, rolesRestringidos))
        .toThrow(UsuarioSinPermiso);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(2);
    });

    it('debería permitir acceso a un COMPRADOR si no está en los roles restringidos', () => {
      const mockUser = { id: 3, nombre: 'Sofi', tipoUsuario: 'COMPRADOR' };
      mockUsuarioRepository.findById.mockReturnValue(mockUser);

      const rolesPermitidos = ['COMPRADOR']; 
      const result = usuariosService.obtenerUsuario(3, rolesPermitidos);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockUser);
    });
  });
});