import { tipoUsuario } from "../models/entities/tipoUsuario.js";

export function tipoUsuarioValidator (tipoUser){
    if(!Object.values(tipoUsuario).includes(tipoUser)){
        return null
    }
    return tipoUser
} 

function getKeyByValue(enumObj, value) {
  return Object.keys(enumObj).find(key => enumObj[key] === value);
}
