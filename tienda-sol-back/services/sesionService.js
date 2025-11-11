import usuarioService from "./usuarioService.js"

class SesionService {
    autenticarUser(username, password) {
        usuarioService.autenticarUser(username, password)
    }
}

export default SesionService