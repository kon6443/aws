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

// const conn = async () => {
//     try {
//         const connection = await mysql.createConnection({
//             host: "localhost",
//             user: process.env.SQL_USER,
//             password: process.env.SQL_PASSWORD,
//             database: 'board_db'
//         });
//         console.log('MySQL has been connected.');
//     } catch(err) {
//         console.log(err);
//     }
// };

module.exports = conn;
