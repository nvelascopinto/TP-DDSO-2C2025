import tiendaService from "../services/tiendaService.js"

class TiendaController {

    getTiendas(req,res){
      return Promise.resolve()
      .then(() => 
        tiendaService.getTiendas()
      )
      .then((tiendas) =>
        res.status(200).json(tiendas)
      )
    }

    getTiendaByName(req, res) {
        return Promise.resolve()
      .then(() =>
        tiendaService.getTiendaByName(req.params.id)
      ) 
      .then((tienda)=>{
        res.status(200).json(tienda)
      })
    }

}

export default new TiendaController()
    