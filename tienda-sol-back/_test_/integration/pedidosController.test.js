import request from "supertest";
import mongoose from "mongoose";
import { UsuarioModel } from "../../models/schemas/usuarioSchema.js"
import { ProductoModel } from "../../models/schemas/productoSchema.js";
import app from "../../app.js";

beforeAll(async () => {
  await mongoose.connect("mongodb://admin:secret@127.0.0.1:27017/tp-ddso-test?authSource=admin");
})

afterEach(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

afterAll(async () => {
  await mongoose.disconnect()
})

describe("pedidosController", () => {

  it("Crear un pedido correctamente", async () => {
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
      fechaAlta: new Date()
    })

    const vendedor = await UsuarioModel.create({
      username: "vendedorTest",
      nombre: "vendedor",
      password: "12345678",
      email: "vendedor@gmail.com",
      telefono: "+5491112345678",
      tipoUsuario: "Vendedor",
      fechaAlta: new Date()
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
      vendedor: vendedor.username,
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
      moneda: "PESO_ARG"
    }

    const res = await request(app)
      .post("/pedidos")
      .set("X-User", comprador.username)
      .send(body);

    // ------------------------------
    // VALIDACIONES
    // ------------------------------

    expect(res.status).toBe(201)

    expect(res.body).toHaveProperty("_id")
    expect(res.body.direccionEntrega).toHaveProperty("_id")
    expect(res.body.items[0]).toHaveProperty("_id")
    expect(res.body.items[0].producto).toHaveProperty("_id")

    expect(res.body.moneda).toBe("PESO_ARG")
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].cantidad).toBe(2)
    expect(res.body.numero).toBe(1)
    expect(res.body.total).toBe(200)

    expect(res.body.vendedor).toBe(vendedor.username)
    expect(res.body.comprador).toBe(comprador.username)
  })
})