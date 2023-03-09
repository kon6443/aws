// boardRouter.js

const express = require("express");
const router = express.Router();

const path = require('path');

// Importing service
// const boardMiddleWare = require('../../models/board/boardService');
const container = require('../../models/container/container');
const userServiceInstance = container.get('userService');
const boardServiceInstance = container.get('boardService');
const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

// Main page.
router.get('/', async (req, res, next) => {
    if(req.query.search) return next();
    // totalItems, currentPage, itemsPerPage
    let { search, page, limit } = req.query;
    console.log('search:', search,', page:', page,', limit:', limit);
    let articles = await boardServiceInstance.getAllArticles();
    const boardObject = await boardServiceInstance.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles, 
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.currentPage, 
        last_page: boardObject.totalPages, 
        length: boardObject.totalItems, 
        limit: boardObject.itemsPerPage, 
        range_min: boardObject.startIndex,
        range_max: boardObject.endIndex,
        search: search
    });
});

// Show search results.
router.get('/', async (req, res) => {
    let { search, page, limit } = req.query;
    let articles = await boardServiceInstance.searchArticlesByTitle(search);
    if(articles.length === 0) {
        return res.send("<script>alert('No matching article.'); window.location.href = '/board';</script>");
    }
    const boardObject = await boardServiceInstance.getPageItems(articles.length, page, limit);
    return res.render(path.join(__dirname, '../../views/board/board'), {
        articles: articles,
        user: (req.decoded) ? (req.decoded.id) : ('Guest'),
        page_current: boardObject.currentPage,
        last_page: boardObject.totalPages, 
        length: boardObject.totalItems, 
        limit: boardObject.itemsPerPage, 
        range_min: boardObject.startIndex,
        range_max: boardObject.endIndex,
        search: search
    });
});

// Write page.
router.get('/write', async (req, res) => {
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'));
    }
});

router.get('/:id', async (req, res, next) => {
    if(req.query.keyStroke) return next();
    if(req.query.search) return next();
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(user) {
        const article_num = req.params.id;
        const article = await boardServiceInstance.showArticleByNum(article_num);
        const comments = await boardServiceInstance.getComments(article_num);
        return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article, comments: comments, length: comments.length});
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'));
    }
});

router.get('/:keyStroke', async (req, res, next) => {
    if(req.query.search) return next();
    const keyStroke = req.query.keyStroke;
    const titles = await boardServiceInstance.searchTitleByChar(keyStroke);
    return res.status(200).send(titles).end();
});
router.delete('/:id', async (req, res, next) => {
    if(req.body.comment_num) return next();
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    const { article_num } = req.body;
    let article = await boardServiceInstance.showArticleByNum(article_num);
    if(user.id!==article.AUTHOR) {
        return res.status(200).send('Account not matched.').end();
    }
    const affectedRows = await boardServiceInstance.deleteByNum(article_num);
    if(affectedRows===1) {
        return res.status(200).send('Article has been removed.').end(); 
    } else {
        return res.status(200).send('Something went wrong').end(); 
    }
});

router.delete('/:comment', async (req, res) => {
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    const { comment_num } = req.body;
    const commentAuthor = await boardServiceInstance.getCommentAuthorByNum(comment_num);
    if(user.id!==commentAuthor) {
        return res.status(200).send('Account not matched.').end();
    }
    const affectedRows = await boardServiceInstance.deleteComment(comment_num);
    if(affectedRows===1) {
        return res.status(200).send('Comment has been removed.').end();
    } else {
        return res.status(200).send('Something went wrong').end();
    }
});

router.post('/article', async (req, res) => {
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(!user) {
        return res.status(200).send('There is no user information.').end();
    }
    const { title, content } = req.body;
    const author = user.id;
    const affectedRows = await boardServiceInstance.insert(title, content, author);
    if(affectedRows===1) {
        return res.status(200).send('Article has been posted.').end(); 
    } else {
        return res.status(200).send('Something went wrong').end();
    }
});
router.post('/article/:content', async (req, res) => {
    const jwtDecodedUserInfo = req.decoded;
    const user = await userServiceInstance.getLoggedInUser(jwtDecodedUserInfo, req.session.access_token);
    if(user) {
        const {content, article_num, length} = req.body;
        await boardCommentDAO.insertComment(article_num, user.id, content, length);
        return res.status(200).send('Comment has been posted.');
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
});
router.put('/:comment/:content', async (req, res) => {
    const user = req.decoded.id;
    const { comment_num, content } = req.body;
    const commentAuthor = await boardCommentDAO.getCommentAuthorByNum(comment_num);
    if(user === commentAuthor) {
        await boardCommentDAO.editCommentByNum(comment_num, content);
        return res.status(200).send('Comment has been updated.').end();
    } else {
        return res.status(200).send('Account not matched.').end();
    }
});
router.post('/article/:group/:content', async (req, res) => {
    const author = req.decoded.id;
    if(author) {
        const { article_num, group_num, content } = req.body;
        await boardCommentDAO.insertReply(article_num, author, group_num, content);
        return res.status(200).send('Reply has been posted.');
    } else {
        return res.render(path.join(__dirname, '../../views/user/loginPage'), {request_url:request_url});
    }
});
router.get('/article/:id', async (req, res) => {
    const user = req.decoded;
    const article_num = req.params.id;
    let article = await boardServiceInstance.showArticleByNum(article_num);
    article = boardServiceInstance.convertArticleDateFormat(article);
    if(user.id === article.AUTHOR) {
        return res.render(path.join(__dirname, '../../views/board/editArticle'), {user:user, article:article});
    }
});
router.put('/article/:id', async (req, res) => {
    const user = req.decoded;
    const article_num = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    let article = await boardServiceInstance.showArticleByNum(article_num);
    article = boardServiceInstance.convertArticleDateFormat(article);
    const date_obj = new Date();
    article.UPDATE_DATE = date_obj.getFullYear() +"-"+ parseInt(date_obj.getMonth()+1) +"-"+ date_obj.getDate();
    await boardServiceInstance.editArticle(article_num, title, content, article.UPDATE_DATE);
    return res.status(200).send('Your article has been editied.');
});

module.exports = router;
