// boardDAO.js
// connecting MySQL

const conn = require('../MySQLRepository');

// node native promisify
const util = require('util');
const query = util.promisify(conn.query).bind(conn);

class boardRepository {
    constructor() {

    }
    async getAllTables() {
        let table = await query("SELECT * FROM BOARD ORDER BY BOARD_NO DESC;");
        return table;
    }
    
    async getAllTitles() {
        let titles = await query("SELECT TITLE FROM BOARD ORDER BY BOARD_NO DESC;");
        for(let i=0;i<titles.length;i++) titles[i] = titles[i].TITLE;
        return titles;
    }
    
    async getMatchingArticles(title) {
        let articles = await query("SELECT * FROM BOARD WHERE TITLE LIKE '%"+title+"%';");
        return articles;
    }
    
    async showArticleByNum(article_num) {
        const sql = "SELECT * FROM BOARD WHERE BOARD_NO="+article_num+";";
        let article = await query(sql);
        article = article[0];
        return article;
    }
    
    async insert(title, content, author) {
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
    
    async deleteByNum(article_num) {
        let query = `DELETE FROM BOARD WHERE BOARD_NO=`+article_num+`;`;
        await conn.query(query);
    }
    
    async editArticle(article_num, title, content, update) {
        let query = "UPDATE BOARD SET TITLE='"+title+"', content='"+content+"', UPDATE_DATE='"+update+"' WHERE BOARD_NO="+article_num+";";
        await conn.query(query);
    }
}

module.exports = boardRepository;

// exports.getAllTables = async () => {
//     let table = await query("SELECT * FROM BOARD ORDER BY BOARD_NO DESC;");
//     return table;
// }

// exports.getAllTitles = async () => {
//     let titles = await query("SELECT TITLE FROM BOARD ORDER BY BOARD_NO DESC;");
//     for(let i=0;i<titles.length;i++) titles[i] = titles[i].TITLE;
//     return titles;
// }

// exports.getMatchingArticles = async (title) => {
//     let articles = await query("SELECT * FROM BOARD WHERE TITLE LIKE '%"+title+"%';");
//     return articles;
// }

// exports.showArticleByNum = async (article_num) => {
//     const sql = "SELECT * FROM BOARD WHERE BOARD_NO="+article_num+";";
//     let article = await query(sql);
//     article = article[0];
//     return article;
// }

// exports.insert = async (title, content, author) => {
//     // Query to insert multiple rows
//     let query = `INSERT INTO BOARD (TITLE, content, POST_DATE, UPDATE_DATE, AUTHOR) VALUES ?;`;
//     const date_obj = new Date();
//     let post_date = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
//     const update_date = post_date;
//     // Values to be inserted
//     let values = [
//         [title, content, post_date, update_date, author]
//     ];
//     // Executing the query
//     await conn.query(query, [values]);
// }

// exports.deleteByNum = async (article_num) => {
//     let query = `DELETE FROM BOARD WHERE BOARD_NO=`+article_num+`;`;
//     await conn.query(query);
// }

// exports.editArticle = async (article_num, title, content, update) => {
//     let query = "UPDATE BOARD SET TITLE='"+title+"', content='"+content+"', UPDATE_DATE='"+update+"' WHERE BOARD_NO="+article_num+";";
//     await conn.query(query);
// }