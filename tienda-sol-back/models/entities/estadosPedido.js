import { pendiente } from "./estados/estadoPendiente.js";
import { confirmado } from "./estados/estadoConfirmado.js";
import { en_Preparacion } from "./estados/estadoEnPreparacion.js";
import { enviado } from "./estados/estadoEnviado.js";
import { entregado } from "./estados/estadoEntregado.js";
import { cancelado } from "./estados/estadoCancelado.js";

const instanciasEstadosPedido = [pendiente, confirmado, en_Preparacion, enviado, entregado, cancelado];

export const estados = Object.fromEntries(instanciasEstadosPedido.map(e => [e.nombre, e]))
