import request from "supertest";
import app from "../app.js"; 
import { PedidoModel } from "../models/PedidoModel.js";
import { MongoDBClient } from "../config/database.js";

describe("Integración: Crear Pedido", () => {
  let token;

  beforeAll(async () => {
    await MongoDBClient.connect();
  });

  afterAll(async () => {
    await PedidoModel.deleteMany({}); // limpiar pedidos
    //await disconnectDB();
  });

  it("debería crear un pedido correctamente", async () => {
    const bodyPedido = {
      itemsDTO: [
        { productoID: "idProducto1", cantidad: 2 },
        { productoID: "idProducto2", cantidad: 1 }
      ]
    };

    const res = await request(app)
      .post("/pedidos")
      .set("X-User", token) // tu header de autenticación
      .send(bodyPedido);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.items.length).toBe(2);
    expect(res.body.comprador.email).toBe("test@example.com");
  });
});