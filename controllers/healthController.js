export class HealthController {
    health(req, res) {
        return res.status(200).json("Health-check confirmado")
    }
}