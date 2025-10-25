import dotenv from "dotenv"
import app from "./app.js"
import { MongoDBClient } from "./config/database.js"

const PORT = process.env.PORT || 3000
dotenv.config()

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

MongoDBClient.connect()
