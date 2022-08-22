// connecting MySQL

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const conn = require('../models/connectMySQL');

exports.showTables = () => {
    conn.query("SELECT * FROM BOARD;", function (err, result) {
        if (err) throw err;
        console.log('result: ', result);
    });
}

// let title = 'first';
//   let content = 'first content';
//   let post_date = '2022-08-21';
//   let update_date = '2022-08-22';
//   let sql = "INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE) VALUES ("+title+", "+content+", "+post_date+", "+update_date+")";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
// });