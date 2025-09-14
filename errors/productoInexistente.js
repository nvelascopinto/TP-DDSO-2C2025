export class ProductoInexistente extends Error {
    constructor(id){
        super();
        this.name = "ProductoInexistente";
        this.message = "El producto de ID" + id + "no existe"
    }
}