import { Router } from "express"
import sesionController from "../controllers/sesionController.js"

const sesionRouter = Router()

sesionRouter.post("/",(req,res) => {
  return sesionController.login(req, res)
})

export default sesionRouter