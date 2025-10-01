import { Router } from "express"
import PedidoController from "../controllers/pedidoController.js";

const pedidoRouter = Router();

pedidoRouter.get('/:id', (req, res, next) => {
      PedidoController.consultar(req, res);

});

pedidoRouter.post('', (req, res, next) => {

      PedidoController.crear(req, res);

});

pedidoRouter.post('/:id/cambioDeEstado', (req, res, next) => {

      PedidoController.cambioEstado(req, res); // cambiar nombre
  });

export default pedidoRouter