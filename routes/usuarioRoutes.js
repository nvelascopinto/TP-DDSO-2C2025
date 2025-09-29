import { UsuarioController } from "../controllers/usuarioController.js";
import { errorHandler } from "../middleware/middlware.js";
import express from "express";
const pathUsuario = "/usuarios";

export default function usuarioRoutes(getController) {
  const router = express.Router();

  router.post(pathUsuario, (req, res, next) => {
    try {
      getController(UsuarioController).crearUsuario(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get(pathUsuario + "/:id", (req, res, next) => {
    try {
      getController(UsuarioController).verUsuario(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get(pathUsuario + "/:id/pedidos", (req, res, next) => {
    try {
      getController(UsuarioController).verHistorialUsuario(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.use(errorHandler);
  return router;
}
