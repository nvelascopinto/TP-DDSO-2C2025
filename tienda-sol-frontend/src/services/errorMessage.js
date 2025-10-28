export const errorMessages = {
  400: {
    title: 'Solicitud inválida',
    message: 'Revisá los datos ingresados e intentá nuevamente.'
  },
  401: {
    title: 'No autorizado',
    message: 'Tu sesión expiró o no tenés permisos para acceder.'
  },
  403: {
    title: 'Acceso denegado',
    message: 'No tenés permiso para realizar esta acción.'
  },
  404: {
    title: 'Recurso no encontrado',
    message: 'El elemento que buscás no existe o fue eliminado.'
  },
  500: {
    title: 'Error interno del servidor',
    message: 'Ocurrió un problema inesperado. Intentá más tarde.'
  },
  default: {
    title: 'Error desconocido',
    message: 'Algo salió mal. Por favor, intentá nuevamente.'
  }
};