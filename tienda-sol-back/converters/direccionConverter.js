import { DireccionEntregaDTO } from "../models/DTO/direccionEntregaDTO.js"
import { DireccionEntrega } from "../models/entities/direccionEntrega.js"

export function toDireccionDTO(direccionJSON) {
  return new DireccionEntregaDTO(
    direccionJSON.calle,
    direccionJSON.altura,
    direccionJSON.piso,
    direccionJSON.departamento,
    direccionJSON.codigoPostal,
    direccionJSON.ciudad,
    direccionJSON.provincia,
    direccionJSON.pais,
  )
}

export function fromDireccionDTO(direccionDTO) {
  return new DireccionEntrega(
    direccionDTO.calle,
    direccionDTO.altura,
    direccionDTO.piso,
    direccionDTO.departamento,
    direccionDTO.codigoPostal,
    direccionDTO.ciudad,
    direccionDTO.provincia,
    direccionDTO.pais
  )
}
