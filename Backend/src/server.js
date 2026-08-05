const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const turnosRoutes = require("./routes/turnos.routes");
const mascotasRoutes = require("./routes/mascotas.routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/turnos", turnosRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.get("/", (req, res) => {
    res.send("API Veterinaria San Roque funcionando");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
