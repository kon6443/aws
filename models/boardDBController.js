// connecting MySQL

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const conn = require('../models/connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

function convertTableDateFormat(table) {
    for(let i=0;i<table.length;i++) {
        table[i].POST_DATE = table[i].POST_DATE.toISOString().split('T')[0];
        table[i].UPDATE_DATE = table[i].UPDATE_DATE.toISOString().split('T')[0];
    }
    return table;
}

function convertArticleDateFormat(article) {
    article.POST_DATE = article.POST_DATE.toISOString().split('T')[0];
    article.UPDATE_DATE = article.UPDATE_DATE.toISOString().split('T')[0];
    return article;
}

exports.showTable = async () => {
    let table = await query("SELECT * FROM BOARD;");
    table = convertTableDateFormat(table);
    return table;
}

exports.showArticleByNum = async (article_num) => {
    const sql = "SELECT * FROM BOARD WHERE BOARD_NO="+article_num+";";
    let article = await query(sql);
    article = article[0];
    article = convertArticleDateFormat(article);
    return article;
}

exports.insert = async (title, content, author) => {
    // Query to insert multiple rows
    let query = `INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE, AUTHOR) VALUES ?;`;
    
    const date_obj = new Date();
    let post_date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    const update_date = post_date;

    // Values to be inserted
    let values = [
        [title, content, post_date, update_date, author]
    ];
    // Executing the query
    await conn.query(query, [values]);
}