//import TiendaService from "../services/tiendaService.js"

export class TiendaController {

    getTiendas(req,res){
        return Promise.resolve()
      .then(() => 
        usuarioService.consultarTiendas()
      )
      .then((tiendas) =>
        res.status(200).json(tiendas)
      )
    }

    getTiendaByName(req, res) {
       /* return Promise.resolve()
      .then(() =>
        {return tiendaService.getTiendaByName()}
      ) .then((prod)=>{
        res.status(200).json(prod)
      })*/
    }

}
    