
export class UsuarioSinPermiso extends Error {
  constructor(id, accion) {
    super();
    this.name = "UsuarioSinPermiso";
    this.message = "El usuario de ID " + id + " no tiene permiso par " + accion;
  
}}

