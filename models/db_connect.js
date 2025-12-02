require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

try {
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        port: process.env.MYSQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("MySQL pool created.");
} catch (err) {
    console.error("Pool create error:", err);
}

async function query(sql, params) {
    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (err) {
        console.error("QUERY ERROR:", err);
        throw err;
    }
}

module.exports = { pool, query };
// models/Post.js