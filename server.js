import dotenv from "dotenv"
import app from "./app.js"
import { MongoDBClient } from "./config/database.js"
import swaggerRoutes from "./routes/swaggerRoutes.js"

const PORT = process.env.PORT || 3000
dotenv.config()

app.use("/docs", swaggerRoutes)

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

MongoDBClient.connect()
