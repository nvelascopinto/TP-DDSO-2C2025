
export class UsuarioSinPermiso extends Error {
  constructor(id) {
    super();
    this.name = "UsuarioSinPermiso";
    this.message = "El usuario de ID " + id + " no tiene permiso";
  
}}

