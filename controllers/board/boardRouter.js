// boardRouter.js

const express = require("express");
const router = express.Router();

const path = require('path');

// Importing service
// const boardMiddleWare = require('../../models/board/boardService');
const container = require('../../models/container/container');
// const userServiceInstance = container.get('userService');
// const boardServiceInstance = container.get('boardService');
const BoardControllerInstance = container.get('BoardController');
const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', BoardControllerInstance.showMain);
router.get('/', BoardControllerInstance.searchArticleTitle);
router.get('/write', BoardControllerInstance.writeArticle);
router.get('/:id', BoardControllerInstance.showArticle);
router.get('/:keyStroke', BoardControllerInstance.autoComplete);
router.delete('/:id', BoardControllerInstance.deleteArticle);
router.delete('/:comment', BoardControllerInstance.deleteComment);
router.post('/article', BoardControllerInstance.postArticle);
router.post('/article/:content', BoardControllerInstance.postComment);
router.put('/:comment/:content', BoardControllerInstance.editComment);
router.post('/article/:group/:content', BoardControllerInstance.replyComment);
router.get('/article/:id', BoardControllerInstance.showEditingArticle);
router.put('/article/:id', BoardControllerInstance.updateArticle);

module.exports = router;
