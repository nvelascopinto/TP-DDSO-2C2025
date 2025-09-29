import { DatosInvalidos } from "../errors/datosInvalidos.js";
import { UsuarioInexistenteError } from "../errors/usuarioInexistenteError.js";
import { UsuarioSinPermiso } from "../errors/usuarioSinPermisos.js";
import { PedidoInexistenteError } from "../errors/pedidoInexistenteError.js";
import { YaEnEstadoError } from "../errors/yaEnEstadoError.js";
import { PedidoStockInsuficiente } from "../errors/pedidoStockInsuficiente.js";
import { ProductoInexistente } from "../errors/productoInexistente.js";
import { HistorialInexistenteError } from "../errors/historialInexistenteError.js";
import { CambioEstadoInvalidoError } from "../errors/cambioEstadoInvalidoError.js";

export function errorHandler(error, _req, res, _next) {
  console.log(error.message);
  switch (error.name) {
    case UsuarioSinPermiso.name:
      res.status(403).json({
        message: error.message,
      });
      return;
    case UsuarioInexistenteError.name:
      res.status(401).json({
        message: error.message,
      });
      return;
    case DatosInvalidos.name:
      res.status(400).json({
        message: error.message,
      });
      return;
    case PedidoInexistenteError.name:
      res.status(404).json({
        message: error.message,
      });
      return;
    case ProductoInexistente.name:
      res.status(404).json({
        message: error.message,
      });
      return;
    case YaEnEstadoError.name:
      res.status(409).json({
        message: error.message,
      });
      return;
    case PedidoStockInsuficiente.name:
      res.status(409).json({
        message: error.message,
      });
      return;
    case HistorialInexistenteError.name:
      res.status(404).json({
        message: error.message,
      });
      return;
    case CambioEstadoInvalidoError.name:
      res.status(409).json({
        message: error.message,
      });
      return;
    default:
      res.status(500).json({ error: "Algo salio mal en el Servidor" });
      return;
  }
}
