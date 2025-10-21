import { Estado } from "../estado.js"
import { confirmado } from "./estadoConfirmado.js";
import { cancelado } from "./estadoCancelado.js";
import { en_Preparacion } from "./estadoEnPreparacion.js";
import { enviado } from "./estadoEnviado.js";
import { entregado } from "./estadoEntregado.js";
class Pendiente extends Estado {
    constructor() {
        super(
            [confirmado, cancelado, en_Preparacion, enviado, entregado],
            ["Vendedor", "Comprador", "Admin"],
            "Pendiente"
        );
    }
}

export const pendiente = new Pendiente();