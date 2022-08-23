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
    
    const date_obj = new Date();
    const post_date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    const update_date = post_date;

    // Values to be inserted
    let values = [
        [title, content, post_date, update_date, author]
    ];
    // Executing the query
    await conn.query(query, [values]);
}