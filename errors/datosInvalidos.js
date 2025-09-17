export class DatosInvalidos extends Error {
    constructor(message){
        super()
        this.name = "DatosInvalidos"
        this.message = message
    }
}