const sql = require("mssql/msnodesqlv8");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const dbConfig = {
 driver: "ODBC Driver 17 for SQL Server",
 server: process.env.DB_SERVER,
 database: process.env.DB_DATABASE,
 options: {
 instanceName: process.env.DB_INSTANCE,
 trustedConnection: true,
 encrypt: process.env.DB_ENCRYPT === "true",
 trustServerCertificate: process.env.DB_TRUST_CERT === "true",
 enableArithAbort: true
 }
};
let poolPromise = null;
function getConnection() {
 if (!poolPromise) {
 poolPromise = sql.connect(dbConfig).catch((error) => {
 poolPromise = null; // si falló, permitir reintentar
 throw error;
 });
 }
 return poolPromise;
}
module.exports = { sql, getConnection };