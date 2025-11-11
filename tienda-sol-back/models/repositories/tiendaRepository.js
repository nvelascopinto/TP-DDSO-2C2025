import {tiendaModel} from "../schemas/tiendaSchema.js"

class TiendaRepository{
    constructor() {
    this.model = TiendaModel
  }
  
    findTiendas() {
    return this.model.find({ tipoUsuario: "Vendedor" },{ tienda: 1, username: 1, _id: 0 } )
  }
  
  findByName(tienda){
    return this.model.findOne({ nombre: nombreTienda });
  }

}