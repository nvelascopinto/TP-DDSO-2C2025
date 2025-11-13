import usuarioService from "./usuarioService.js"

class SesionService {
    autenticarUser(username, password) {
        return usuarioService.autenticarUser(username, password)
    }
}

export default new SesionService()