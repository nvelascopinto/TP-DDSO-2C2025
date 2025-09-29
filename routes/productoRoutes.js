import { ProductoController } from "../controllers/productoController.js";
import { errorHandler } from "../middleware/middlware.js";
import express from "express";

const pathProducto = "/productos";

export default function productoRoutes(getController) {
  const router = express.Router();

  router.post(pathProducto, (req, res, next) => {
    try {
      getController(ProductoController).crear(req, res);
    } catch (err) {
      next(err);
    }
  });
  router.use(errorHandler);
  return router;
}
