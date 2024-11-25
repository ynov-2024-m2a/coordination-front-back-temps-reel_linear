const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
    connectionLimit: 5,
    supportBigNumbers: true
});


module.exports = db;