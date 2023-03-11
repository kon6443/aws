// boardRouter.js

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const BoardControllerInstance = container.get('BoardController');
const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', BoardControllerInstance.showMain.bind(BoardControllerInstance));
router.get('/', BoardControllerInstance.searchArticleTitle.bind(BoardControllerInstance));
router.get('/write', BoardControllerInstance.writeArticle.bind(BoardControllerInstance));
router.get('/:id', BoardControllerInstance.showArticle.bind(BoardControllerInstance));
router.get('/:keyStroke', BoardControllerInstance.autoComplete.bind(BoardControllerInstance));
router.delete('/:id', BoardControllerInstance.deleteArticle.bind(BoardControllerInstance));
router.delete('/:comment', BoardControllerInstance.deleteComment.bind(BoardControllerInstance));
router.post('/article', BoardControllerInstance.postArticle.bind(BoardControllerInstance));
router.post('/article/:content', BoardControllerInstance.postComment.bind(BoardControllerInstance));
router.put('/:comment/:content', BoardControllerInstance.editComment.bind(BoardControllerInstance));
router.post('/article/:group/:content', BoardControllerInstance.replyComment.bind(BoardControllerInstance));
router.get('/article/:id', BoardControllerInstance.showEditingArticle.bind(BoardControllerInstance));
router.put('/article/:id', BoardControllerInstance.updateArticle.bind(BoardControllerInstance));

module.exports = router;
