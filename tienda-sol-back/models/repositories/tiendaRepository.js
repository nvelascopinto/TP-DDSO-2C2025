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
    return this.model.findOne({username: idUsuario}, {_id: 0, __v:0})
  }
  
  getTiendas() {
    return this.model.find()
  }

  getTiendaByName(tiendaNombre) {
    return this.model.find({nombre: tiendaNombre})
  }
}

export default new tiendaRepository()
