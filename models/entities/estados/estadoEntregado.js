import { Estado } from "../estado.js"
class Entregado extends Estado {
    constructor() {
        super(
            [],
            ["Vendedor", "Admin"],
            "Entregado"
        );
    }
}

export const entregado = new Entregado();