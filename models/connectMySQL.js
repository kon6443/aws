// Connecting MySQL

var mysql = require('mysql');
const config = require('../config/config');

const conn = mysql.createConnection({
    host: "localhost",
    user: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    database: 'board_db'
});

module.exports = conn;
