const { sql, getConnection } = require("../config/db");
async function obtenerTurnos(req, res) {
    try {
        const pool = await getConnection();
        const resultado = await pool.request().query(`
 SELECT T.Id_Turno AS idTurno, T.Fecha AS fecha, T.Hora AS hora,
 T.Motivo AS motivo, T.Atendido AS atendido,
 M.Nombre AS mascota, M.Especie AS especie,
 C.Apellido + ', ' + C.Nombre AS duenio, C.Telefono AS telefono
 FROM Turnos AS T
 INNER JOIN Mascotas AS M ON M.Id_Mascota = T.Id_Mascota
 INNER JOIN Clientes AS C ON C.Id_Cliente = M.Id_Cliente
 ORDER BY T.Fecha, T.Hora
 `);
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener turnos", error: error.message });
    }
}

async function crearTurno(req, res) {
    try {
        const { idMascota, fecha, hora, motivo } = req.body;
        if (!idMascota || !fecha || !hora || !motivo) {
            return res.status(400).json({ mensaje: "Debe completar todos los datos" });
        }
        const pool = await getConnection();
        const resultado = await pool.request()
            .input("idMascota", sql.Int, idMascota)
            .input("fecha", sql.Date, fecha)
            .input("hora", sql.NVarChar(5), hora)
            .input("motivo", sql.NVarChar(150), motivo)
            .query(`
 INSERT INTO Turnos (Id_Mascota, Fecha, Hora, Motivo, Atendido)
 OUTPUT INSERTED.Id_Turno AS idTurno
 VALUES (@idMascota, @fecha, @hora, @motivo, 0)
 `);
        res.status(201).json({
            mensaje: "Turno registrado correctamente",
            idTurno: resultado.recordset[0].idTurno
        });
    } catch (error) {
        if (error.number === 547) { // violación de FK
            return res.status(400).json({ mensaje: "La mascota indicada no existe" });
        }
        res.status(500).json({ mensaje: "Error al registrar el turno", error: error.message });
    }
}
module.exports = { obtenerTurnos, crearTurno };
