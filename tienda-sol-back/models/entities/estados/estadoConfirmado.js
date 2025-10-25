import { Estado } from "../estado.js"
import { cancelado } from "./estadoCancelado.js";
import { en_Preparacion } from "./estadoEnPreparacion.js";
import { enviado } from "./estadoEnviado.js";
import { entregado } from "./estadoEntregado.js";
class Confirmado extends Estado {
    constructor() {
        super(
            [cancelado, en_Preparacion, enviado, entregado],
            ["Vendedor"],
            "Confirmado"
        );
    }
}

export const confirmado = new Confirmado();