import { Router } from "express"
import healthController from "../controllers/healthController.js"

const healthRouter = Router()

healthRouter.get("/health-check", healthController.health)

export default healthRouter
