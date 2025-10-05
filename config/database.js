import mongoose from "mongoose"

export class MongoDBClient {
  static connect() {
    return mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_DB_NAME}`)
      .then((conn) => {
        console.log(`MongoDB is connected: ${conn.connection.host}`)
    }) 
      .catch ((error) => {
      console.error(`Error: ${error.message}`)
      process.exit(1)
    })
}
}