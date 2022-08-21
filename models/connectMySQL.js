// connecting MySQL

const path = require('path');
var mysql = require('mysql');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

exports.connectMySQL = () => {
  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: 'board_db'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL connected...");
  });
}