

import { Moneda } from "../models/entities/moneda.js";
export function monedaValidator (moneda){
    if(!Object.keys(Moneda).includes(moneda)){
        return null
    }
    return moneda
} 