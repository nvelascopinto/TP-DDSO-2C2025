export const estado = Object.freeze({
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En_Preparacion",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
})

export const ordenEstados = [
  estado.PENDIENTE,
  estado.CONFIRMADO,
  estado.EN_PREPARACION,
  estado.CANCELADO,
  estado.ENVIADO,
  estado.ENTREGADO,
]

export const autorizadosAEstado = Object.freeze({
  PENDIENTE: ["Vendedor", "Comprador, Admin"],
  CONFIRMADO: ["Vendedor"],
  EN_PREPARACION: ["Vendedor"],
  ENVIADO: ["Vendedor"],
  ENTREGADO: ["Vendedor", "Admin"],
  CANCELADO: ["Vendedor", "Comprador", "Admin"],
})
