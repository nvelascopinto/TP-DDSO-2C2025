import usuarioRepository from "../models/repositories/usuarioRepository.js";


export function authenticate(_res, req, next) { 
    const idUser = req.body.id
    const user = usuarioRepository.findById(idUser)
    req.user = user
    next()
}