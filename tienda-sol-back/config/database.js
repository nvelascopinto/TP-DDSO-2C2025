import mongoose from "mongoose"

const uri = process.env.MONGODB_URI || "mongodb://admin:secret@127.0.0.1:27017/tp-ddso?authSource=admin"
export class MongoDBClient {
  static connect() {
    // PARA QUE EN LOS TESTS NO PIDA AUTENTICAC
    if (process.env.NODE_ENV === "test") {
      const uriTest = "mongodb://admin:rootpass@127.0.0.1:28017/tp-test?authSource=admin"
      console.log("Conectando a Mongo (modo test):", uriTest)



      return mongoose.connect(uriTest)
        .then(() => console.log("MongoDB test conectado"))
        .catch((error) => {
          console.error("Error conectando test DB:", error.message)
          process.exit(1)
        })
    }
    if(process.env.NODE_ENV == "production") {
        return mongoose.connect(process.env.MONGODB_PROD)
        .then(() => console.log("MongoDB produccion conectado"))
        .catch((error) => {
          console.error("Error conectando test DB:", error.message)
          process.exit(1)
        })
    }


    console.log("Conectando a:", uri)
    return mongoose.connect(uri)
      .then((conn) => {
        console.log(`MongoDB is connected: ${conn.connection.host}`)
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`)
        process.exit(1)
      })
  }
}
