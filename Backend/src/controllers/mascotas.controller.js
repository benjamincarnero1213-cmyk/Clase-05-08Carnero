const { sql, getConnection } = require("../config/db");

async function obtenerMascotas(req, res) {
    try {
        const pool = await getConnection();
        const resultado = await pool.request().query(`
 SELECT M.Id_Mascota AS idMascota, M.Nombre AS nombre, M.Especie AS especie,
 C.Apellido + ', ' + C.Nombre AS duenio, C.Telefono AS telefono
 FROM Mascotas AS M
 INNER JOIN Clientes AS C ON C.Id_Cliente = M.Id_Cliente
 ORDER BY M.Nombre
 `);
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener mascotas", error: error.message });
    }
}

module.exports = { obtenerMascotas };
