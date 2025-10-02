import { Router } from "express"
import HealthController from "../controllers/healthController.js"

const healthRouter = Router()

healthRouter.get("/health-check", HealthController.health)

export default healthRouter
