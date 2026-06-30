import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "103.15.242.93",
  user: process.env.DB_USER || "epbb_db",
  password: process.env.DB_PASSWORD || "Fnh2tZ7XX6DcdNFw",
  database: process.env.DB_NAME || "epbb_db",
  port: parseInt(process.env.DB_PORT || "30060"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export default pool;
