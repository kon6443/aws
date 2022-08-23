// connecting MySQL

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const conn = require('../models/connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

exports.showTable = async () => {
    const table = await query("SELECT * FROM BOARD;");
    return table;
}

exports.insert = async (title, content, author) => {
    // Query to insert multiple rows
    let query = `INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE, AUTHOR) VALUES ?;`;
    const post_date = '2022-08-22';
    const update_date = '2022-08-23';
    // Values to be inserted
    let values = [
        [title, content, post_date, update_date, author]
    ];
    const values2 = "'"+title+"','"+content+"','"+post_date+"','"+update_date+"','"+author+"'";
    let query2 = "INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE, AUTHOR) VALUES ("+values2+");";
    console.log(query2);
    const table = await query(query2);
    console.log(table);
    console.log('done.');
    // Executing the query
    // conn.query(query, [values], (err, rows) => {
    //     if (err) throw err;
    //     console.log("All Rows Inserted");
    // });
}