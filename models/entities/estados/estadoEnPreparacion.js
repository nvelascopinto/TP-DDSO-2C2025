import { Estado } from "../estado.js"
import { cancelado } from "./estadoCancelado.js";
import { enviado } from "./estadoEnviado.js";
import { entregado } from "./estadoEntregado.js";
class EnPreparacion extends Estado {
    constructor() {
        super(
            [cancelado, enviado, entregado],
            ["Vendedor"],
            "En Preparación"
        );
    }
}

export const en_Preparacion = new EnPreparacion();