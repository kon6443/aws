// boardCommentDAO.js

// connecting MySQL
const conn = require('../connectMySQL');

const util = require('util');
// node native promisify
const query = util.promisify(conn.query).bind(conn);

exports.getMaxCommentOrder = async (article_num, group_num) => {
    const sql = `select max(comment_order) as maxCommentOrder from comment where article_num=${article_num} and group_num=${group_num};`;
    const return_val = await query(sql);
    return return_val[0].maxCommentOrder;
}

exports.getNewGroupNum = async (article_num) => {
    const sql = `select max(comment.group_num) as maxGroupNum from BOARD left join comment on BOARD.BOARD_NO=comment.article_num where BOARD.BOARD_NO=${article_num};`;
    const return_val = await query(sql);
    return return_val[0].maxGroupNum + 1;
}

exports.getTime = () => {
    const date_obj = new Date();
    let date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate()+" ";
    let time = date_obj.getHours() +":"+ date_obj.getMinutes() +":"+ date_obj.getSeconds();
    time = date+time;
    return time;
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
    const time = this.getTime();
    const depth = 0;
    const group_num = await this.getNewGroupNum(article_num);
    // const comment_order = parseInt(length) + 1;
    const comment_order = await this.getMaxCommentOrder(article_num, group_num) + 1;
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
    const time = this.getTime();
    const depth = 1;
    const comment_order = await this.getMaxCommentOrder(article_num, group_num) + 1;
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