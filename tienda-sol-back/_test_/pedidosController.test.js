import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UsuarioModel } from "../models/schemas/usuarioSchema.js"
import { ProductoModel } from "../models/schemas/productoSchema.js";
import app from "../app.js";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/tp-ddso-test");
})

afterEach(async () => {
  await mongoose.connection.dropDatabase();
})

afterAll(async () => {
  await mongoose.disconnect();
})


// beforeEach(async () => {
//   await mongoose.connection.dropDatabase()

//   comprador = await UsuarioModel.create({
//     username: "compradorTest",
//     password: "1234",
//     tipoUsuario: "Comprador"
//   })

//   producto = await ProductoModel.create({
//     nombre: "Producto test",
//     precio: 100,
//     stock: 20
//   })
// })

describe("pedidosController", () => {

  it("Crea un pedido correctamente", async () => {
    // ------------------------------
    // BASE DE DATOS PARA LOS TESTS
    // ------------------------------

    const comprador = await UsuarioModel.create({
      username: "compradorTest",
      nombre: "comprador",
      password: "12345678",
      email: "comprador@gmail.com",
      telefono: "+5491112345678",
      tipoUsuario: "Comprador",
    })

    const vendedor = await UsuarioModel.create({
      username: "vendedorTest",
      nombre: "vendedor",
      password: "12345678",
      email: "vendedor@gmail.com",
      telefono: "+5491112345678",
      tipoUsuario: "Vendedor",
    })
    
    const producto = await ProductoModel.create({
      vendedor: "vendedorTest",
      titulo: "Remera falsa",
      descripcion: "Este es un producto falso",
      categoria: "Ropa",
      precio: 100,
      moneda: "PESO_ARG",
      stock: 100,
      activo: true,
      cantVentas: 0
    })

    // ------------------------------
    // CREAR PEDIDO
    // ------------------------------

    const body = {
      vendedor: vendedor._id,
      items: [
        { producto: producto._id, cantidad: 2 }
      ],
      direccionEntrega: {
        calle: "Calle falsa",
        altura: "123",
        codigoPostal: "321",
        ciudad: "Ciudad falsa",
        provincia: "Provincia falsa",
        pais: "Pais falso"
      },
      moneda: "ARS"
    }

    const res = await request(app).post("/pedidos").send(body);

    // ------------------------------
    // VALIDACIONES
    // ------------------------------

    expect(res.status).toBe(201);

    // Pedido general
    expect(res.body).toHaveProperty("_id");
    expect(res.body.moneda).toBe("ARS");

    // Items
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].cantidad).toBe(2);

    // Vendedor
    expect(res.body.vendedor).toBe(vendedorDB._id.toString());

    // Comprador (mockeado)
    expect(res.body.comprador).toBe("usuarioTest");
  })
});