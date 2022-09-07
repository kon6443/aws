// boardCommentDB.js
// connecting MySQL

const conn = require('../models/connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

async function getMaxGroupNum(article_num) {
    const sql = `select max(comment.group_num) as maxGroupNum from board left join comment on board.BOARD_NO=comment.article_num where board.BOARD_NO=${article_num};`;
    const temp = await query(sql);
    return temp[0].maxGroupNum;
}

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

function getTime() {
    const date_obj = new Date();
    let date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate()+" ";
    let time = date_obj.getHours() +":"+ date_obj.getMinutes() +":"+ date_obj.getSeconds();
    time = date+time;
    return time;
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

exports.insertComment = async (article_num, author, content, length) => {
    // insert into comment (article_num, author, time, class, comment_order, group_num, content) VALUES (24, 'prac', '2022-09-02', 1, 1, 1, 'this is a comment content');
    const sql = `INSERT INTO COMMENT (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
    const time = getTime();
    const depth = 0;
    const maxGroupNum = await getMaxGroupNum(article_num);
    const group_num = maxGroupNum + 1;
    comment_order = parseInt(length) + 1;
    let values = [
        [article_num, author, time, depth, comment_order, group_num, content]
    ];
    await conn.query(sql, [values]);
}

exports.insertReply = async (article_num, comment_num, content) => {
    const time = getTime();
    // let values = [
    //     [article_num, author, time, depth, comment_order, group_num, content]
    // ];
    // await conn.query(sql, [values]);
}

exports.deleteComment = async (article_num, comment_num) => {
    const sql = `update comment set author='deleted', content='deleted', time=NULL  where article_num=${article_num} and comment_num=${comment_num};`;
    await conn.query(sql);
}