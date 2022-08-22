// connecting MySQL

const path = require('path');
var mysql = require('mysql');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const conn = mysql.createConnection({
    host: "localhost",
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'board_db'
});

conn.connect();

module.exports = conn;
