const express = require("express");
const router = express.Router();
const { obtenerTurnos, crearTurno } = require("../controllers/turnos.controller");
router.get("/", obtenerTurnos); // GET /api/turnos
router.post("/", crearTurno); // POST /api/turnos
module.exports = router;
