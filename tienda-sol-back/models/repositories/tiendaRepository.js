import { TiendaModel } from "../schemas/tiendaSchema.js"

class tiendaRepository {
  constructor() {
    this.model = TiendaModel
  }

  crear(tienda) {
    const nuevaTienda = new this.model(tienda)
    return nuevaTienda.save()
  }

  getTiendaByUsername(idUsuario) {
    return this.model.find({username: idUsuario})
  }
  
  getTiendas() {
    return this.model.find()
  }

  getTiendaByName(tiendaNombre) {
    return this.model.find({nombre: tiendaNombre})
  }
}

export default new tiendaRepository()
