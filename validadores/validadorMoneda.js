

import { Moneda } from "../models/entities/moneda.js";
export function monedaValidator (moneda){
    if(!Object.values(Moneda).includes(moneda)){
        return null
    }
    return getKeyByValue(Moneda, moneda)
} 


function getKeyByValue(enumObj, value) {
  return Object.keys(enumObj).find(key => enumObj[key] === value);
}
