class HealthController {
  health(_req, res) {
    return res.status(200).json("Health-check confirmado")
  }
}

export default new HealthController()
