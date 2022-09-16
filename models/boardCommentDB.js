// boardCommentDB.js
// connecting MySQL

const conn = require('../models/connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

async function getNewCommentOrder(article_num, group_num) {
    const sql = `select max(comment_order) as maxCommentOrder from comment where article_num=${article_num} and group_num=${group_num};`;
    const return_val = await query(sql);
    return return_val[0].maxCommentOrder + 1;
}

async function getNewGroupNum(article_num) {
    const sql = `select max(comment.group_num) as maxGroupNum from BOARD left join comment on BOARD.BOARD_NO=comment.article_num where BOARD.BOARD_NO=${article_num};`;
    const return_val = await query(sql);
    return return_val[0].maxGroupNum + 1;
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
    // const sql = "SELECT * FROM COMMENT WHERE article_num='"+article_num+"';";
    const sql = `select * from comment where article_num=${article_num} order by group_num, comment_order asc;`
    let comments = await query(sql);
    return comments
}

exports.insertComment = async (article_num, author, content, length) => {
    // insert into comment (article_num, author, time, class, comment_order, group_num, content) VALUES (24, 'prac', '2022-09-02', 1, 1, 1, 'this is a comment content');
    const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
    const time = getTime();
    const depth = 0;
    const group_num = await getNewGroupNum(article_num);
    // const comment_order = parseInt(length) + 1;
    const comment_order = await getNewCommentOrder(article_num, group_num);
    let values = [
        [article_num, author, time, depth, comment_order, group_num, content]
    ];
    await conn.query(sql, [values]);
}

exports.editCommentByNum = async (comment_num, content) => {
    const query = `UPDATE comment SET content='${content}' WHERE comment_num=${comment_num};`
    await conn.query(query);
}

exports.insertReply = async (article_num, author, group_num, content) => {
    const sql = `INSERT INTO comment (article_num, author, time, class, comment_order, group_num, content) VALUES ?;`;
    const time = getTime();
    const depth = 1;
    const comment_order = await getNewCommentOrder(article_num, group_num);
    let values = [
        [article_num, author, time, depth, comment_order, group_num, content]
    ];
    await conn.query(sql, [values]);
}

exports.getCommentAuthorByNum = async (comment_num) => {
    const sql = `select author from comment where comment_num=${comment_num};`;
    let commentAuthor = await query(sql);
    return commentAuthor[0].author;
}

exports.deleteComment = async (comment_num) => {
    const sql = `update comment set author='deleted', content='deleted', time=NULL where comment_num=${comment_num};`;
    await conn.query(sql);
}