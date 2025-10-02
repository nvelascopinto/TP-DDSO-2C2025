import NotificacionService from "../services/notificacionService.js"

class notificacionController {
  constructor(notificacionService) {
    this.notificacionService = notificacionService
  }
}

export default new notificacionController(NotificacionService)
