import { HealthController } from "../controllers/healthController.js"

import express from "express"

const pathHealth = "/health-check"

export default function healthRoutes (getController) {
    const router = express.Router() 

    router.get(pathHealth, (req,res) => {
        getController(HealthController).health(req,res)
    })
    return router
}