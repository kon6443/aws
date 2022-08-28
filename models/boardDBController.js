// connecting MySQL

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
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

exports.getAllTitles = async () => {
    let titles = await query("SELECT TITLE FROM BOARD ORDER BY BOARD_NO DESC;");
    for(let i=0;i<titles.length;i++) titles[i] = titles[i].TITLE;
    return titles;
}

exports.getMatchingArticles = async (title) => {
    let articles = await query("SELECT * FROM BOARD WHERE TITLE LIKE '%"+title+"%';");
    return convertTableDateFormat(articles);
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

exports.deleteByNum = async (article_num) => {
    let query = `DELETE FROM BOARD WHERE BOARD_NO=`+article_num+`;`;
    await conn.query(query);
}

exports.editArticle = async (article_num, title, content, update) => {
    let query = "UPDATE BOARD SET TITLE='"+title+"', content='"+content+"', UPDATE_DATE='"+update+"' WHERE BOARD_NO="+article_num+";";
    await conn.query(query);
}