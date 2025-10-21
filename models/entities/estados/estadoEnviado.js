import { Estado } from "../estado.js"
import { entregado } from "./estadoEntregado.js";
class Enviado extends Estado {
    constructor() {
        super(
            [entregado],
            ["Vendedor"],
            "Enviado"
        );
    }
}

export const enviado = new Enviado();