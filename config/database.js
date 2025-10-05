import mongoose from "mongoose"

const uri = process.env.MONGODB_URI || "mongodb://root:secret@127.0.0.1:27017/tp-ddso?authSource=admin"
export class MongoDBClient {
  static connect() {
    console.log("Conectando a:", uri)
    return mongoose.connect(uri)
      .then((conn) => {
        console.log(`MongoDB is connected: ${conn.connection.host}`)
    }) 
      .catch ((error) => {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    })
}
}