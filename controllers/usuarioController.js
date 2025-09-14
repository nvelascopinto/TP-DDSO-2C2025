import { convertJSONtoUsuario } from "../conversores/conversoresUsuario.js"
import {z} from "zod"
import { usuarioSchema } from "../validadores/validadorUsuario.js"

export class UsuarioController {

    constructor(usuarioService) {
        this.usuarioService = usuarioService
    }

    crearUsuario(req, res) {
        const body = req.body
        
        const usuarioResult = usuarioSchema.safeParse(body)
        
                if (!usuarioResult.success) {
                    throw new DatosInvalidos(usuarioResult.error.issues.map(i => i.message))
                }
        
           
        
        const usuario= convertJSONtoUsuario(usuarioResult.data)
        
        const nuevoUsuario = this.usuarioService.crearUsuario(usuario)

        return res.status(201).json(nuevoUsuario)
    }

    verUsuario(req, res) {
        const resultId = idTransform.safeParse(req.params.id)

        if (resultId.error) {
            res.status(400).json(resultId.error.issues)
            return
        }

        const id = resultId.data

        const usuario = this.usuarioService.buscar(id)

        res.status(200).json(usuario);
    }
}

const idTransform = z.string().transform(((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) {
        ctx.addIssue({
            code: "INVALID_ID",
            message: "id must be a number"
        });
        return z.NEVER;
    }
    return num;
}))