// boardService.js
const express = require("express");
const app = express();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');

// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');
    
const boardDAO = require('./boardDAO');
const boardCommentDAO = require('./boardCommentDAO');

exports.convertDateFormat = (date) => {
    date = date.toLocaleString('default', {year:'numeric', month:'2-digit', day:'2-digit'});
    let year = date.substr(6,4);
    let month = date.substr(0,2);
    let day = date.substr(3,2);
    let convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
}

exports.convertTableDateFormat = (table) => {
    for(let i=0;i<table.length;i++) {
        table[i].POST_DATE = this.convertDateFormat(table[i].POST_DATE);
        table[i].UPDATE_DATE = this.convertDateFormat(table[i].UPDATE_DATE);
    }
    return table;
}

exports.convertArticleDateFormat = (article) => {
    article.POST_DATE = this.convertDateFormat(article.POST_DATE);
    article.UPDATE_DATE = this.convertDateFormat(article.UPDATE_DATE);
    return article;
}

exports.getTitlesIncludeString = async (titles, search) => {
    let result = [];
    for(let i=0;i<titles.length;i++) {
        if(titles[i].includes(search)) result.push(titles[i]);
    }
    return result;
}

 exports.getPageItems = async (articles_length, page, limit) => {
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));
    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;
    let last_page = Math.ceil(articles_length/limit);
    const obj = {
        page: page, 
        limit: limit,
        last_page: last_page,
        range_min: (page-1)*limit, 
        range_max: (page === last_page) ? (articles_length) : (page*limit)
    }
    return obj;
}

/**
 * ===============================================================================================================================
 */
// Main login page.
exports.showMain = async (req, res, next) => {
    if(req.query.search) return next();
    let { search, page, limit } = req.query;
    let articles = await boardDAO.getAllTables();
    articles = this.convertTableDateFormat(articles);
    const boardObject = await this.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles, 
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.page, 
        last_page: boardObject.last_page, 
        length: articles.length, 
        limit: boardObject.limit, 
        range_min: boardObject.range_min,
        range_max: boardObject.range_max,
        search: search
    });
}

exports.searchByTitle = async (req, res) => {
    let { search, page, limit } = req.query;
    let articles = await boardDAO.getMatchingArticles(search);
    articles = this.convertTableDateFormat(articles);
    if(articles.length === 0) {
        return res.send("<script>alert('No matching article.'); window.location.href = '/board';</script>");
    }
    const boardObject = await this.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles,
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.page,
        last_page: boardObject.last_page, 
        length: articles.length, 
        limit: boardObject.limit, 
        range_min: boardObject.range_min,
        range_max: boardObject.range_max,
        search: search
    });
}

exports.showPost = async (req, res, next) => {
    if(req.query.keyStroke) return next();
    if(req.query.search) return next();
    const user = req.decoded;
    if(user) {
        const article_num = req.params.id;
        let article = await boardDAO.showArticleByNum(article_num);
        article = this.convertArticleDateFormat(article);
        let comments = await boardCommentDAO.getComments(article_num);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article, comments: comments, length: comments.length});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.postComment = async (req, res) => {
    const user = req.decoded;
    if(user) {
        const {content, article_num, length} = req.body;
        await boardCommentDAO.insertComment(article_num, user.id, content, length);
        return res.status(200).send('Comment has been posted.');
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.editComment = async (req, res) => {
    const user = req.decoded.id;
    const { comment_num, content } = req.body;
    const commentAuthor = await boardCommentDAO.getCommentAuthorByNum(comment_num);
    if(user === commentAuthor) {
        await boardCommentDAO.editCommentByNum(comment_num, content);
        return res.status(200).send('Comment has been updated.').end();
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.postReply = async (req, res) => {
    const author = req.decoded.id;
    if(author) {
        const { article_num, group_num, content } = req.body;
        await boardCommentDAO.insertReply(article_num, author, group_num, content);
        return res.status(200).send('Reply has been posted.');
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.autoComplete = async (req, res, next) => {
    if(req.query.search) return next();
    const keyStroke = req.query.keyStroke;
    const titles = await boardDAO.getAllTitles();
    const result = await getTitlesIncludeString(titles, keyStroke);
    return res.status(200).send(result).end();
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
        await boardDAO.insert(title, content, author);
        return res.status(200).send('Article has been posted.').end(); 
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/login.html'));
    }
}

exports.deleteArticle = async (req, res, next) => {
    if(req.body.comment_num) return next();
    const user = req.decoded;
    const { article_num } = req.body;
    let article = await boardDAO.showArticleByNum(article_num);
    article = this.convertArticleDateFormat(article);
    if(user.id === article.AUTHOR) {
        await boardDAO.deleteByNum(article_num);
        return res.status(200).send('Article has been removed.').end(); 
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.deleteComment = async (req, res) => {
    const user = req.decoded.id;
    const { comment_num } = req.body;
    const commentAuthor = await boardCommentDAO.getCommentAuthorByNum(comment_num);
    if(user === commentAuthor) {
        await boardCommentDAO.deleteComment(comment_num);
        return res.status(200).send('Comment has been removed.').end();
    } else {
        return res.status(200).send('Account not matched.').end();
    }
}

exports.editArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.params.id;
    let article = await boardDAO.showArticleByNum(article_num);
    article = convertArticleDateFormat(article);
    if(user.id === article.AUTHOR) {
        return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
    }
}

exports.submitEditedArticle = async (req, res) => {
    const user = req.decoded;
    const article_num = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    let article = await boardDAO.showArticleByNum(article_num);
    article = convertArticleDateFormat(article);
    const date_obj = new Date();
    article.UPDATE_DATE = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    await boardDAO.editArticle(article_num, title, content, article.UPDATE_DATE);
    return res.status(200).send('Your article has been editied.');
}