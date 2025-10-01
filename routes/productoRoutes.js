import { Router } from "express";
import ProductoController from "../controllers/productoController.js";

  const productoRouter = Router();

  productoRouter.post('/', (req, res, next) => {
      ProductoController.crear(req, res);

  });
   
export default productoRouter;
