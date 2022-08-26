// login.controller.js

const express = require("express");
const app = express();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');
    
const dbMySQLModel = require('../../models/boardDBController');

async function getBoardItems(page, limit) {
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;
    const articles = await dbMySQLModel.showTable();
    let article_total = articles.length;
    let page_max = Math.ceil(article_total/limit);
    let range_max;
    const range_min = (page-1)*limit;
    (page === page_max) ? (range_max = articles.length) : (range_max = page*limit)
    const obj = {
        page:page, 
        limit:limit, 
        articles:Object(articles),
        page_max:page_max, 
        range_min:range_min, 
        range_max:range_max
    }
    return obj;
}

// Main login page.
exports.showMain = async (req, res) => {
    let { page, limit } = req.query;
    const boardObject = await getBoardItems(page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles:boardObject.articles, 
        page_current:boardObject.page, 
        page_max:boardObject.page_max, 
        length:boardObject.articles.length, 
        limit:boardObject.limit, 
        range_min:boardObject.range_min,
        range_max:boardObject.range_max
    });
}

exports.showPost = async (req, res) => {
    const user = req.decoded;
    if(user) {
        const article_num = req.params.id;
        let article = await dbMySQLModel.showArticleByNum(article_num);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

// Writing page.
exports.boardWrite = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.insertArticle = async (req, res) => {
    const user = req.decoded;
    const { title, content } = req.body;
    if(user) {
        const author = user.id;
        await dbMySQLModel.insert(title, content, author);
        return res.status(200).send('Article has been posted.').end(); 
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.deleteArticle = async (req, res) => {
    const user = req.decoded;
    const { article_num } = req.body;
    const article = await dbMySQLModel.showArticleByNum(article_num);
    if(user.id === article.AUTHOR) {
        await dbMySQLModel.deleteByNum(article_num);
        return res.status(200).send('Article has been removed.').end(); 
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.editArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.params.id;
    const article = await dbMySQLModel.showArticleByNum(article_num);
    if(user.id === article.AUTHOR) {
        return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
    }
}

exports.submitEditedArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    let article = await dbMySQLModel.showArticleByNum(article_num);
    const date_obj = new Date();
    article.UPDATE_DATE = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    await dbMySQLModel.editArticle(article_num, title, content, article.UPDATE_DATE);
    return res.status(200).send('Your article has been editied.');
}