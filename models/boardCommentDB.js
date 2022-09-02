// boardCommentDB.js
// connecting MySQL

const conn = require('../models/connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

function convertDateFormat(date) {
    date = date.toLocaleString('default', {year:'numeric', month:'2-digit', day:'2-digit'});
    let year = date.substr(6,4);
    let month = date.substr(0,2);
    let day = date.substr(3,2);
    let convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
}

function convertTableDateFormat(table) {
    for(let i=0;i<table.length;i++) {
        table[i].POST_DATE = convertDateFormat(table[i].POST_DATE);
        table[i].UPDATE_DATE = convertDateFormat(table[i].UPDATE_DATE);
    }
    return table;
}

function convertArticleDateFormat(article) {
    article.POST_DATE = convertDateFormat(article.POST_DATE);
    article.UPDATE_DATE = convertDateFormat(article.UPDATE_DATE);
    return article;
}

exports.showTable = async () => {
    let table = await query("SELECT * FROM BOARD ORDER BY BOARD_NO DESC;");
    table = convertTableDateFormat(table);
    return table;
}

exports.getComments = async (article_num) => {
    const sql = "SELECT * FROM COMMENT WHERE article_num='"+article_num+"';";
    let comments = await query(sql);
    return comments
}

exports.insertComment = async (article_num) => {
    // insert into comment (comment_num, article_num, author, time, class, comment_order, group_num) VALUES (1, 24, 'prac', '2022-09-02', 1, 1, 1);
    const sql = `INSERT INTO COMMENT (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
    let values = [
        [article_num, author, time, classs, comment_order, group_num, content]
    ];
    await conn.query(sql, [values]);
}