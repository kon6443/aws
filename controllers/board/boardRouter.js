// boardRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const boardMiddleWare = require('./board.controller');

const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', boardMiddleWare.showMain);
router.get('/', boardMiddleWare.searchByTitle);
router.get('/write', boardMiddleWare.boardWrite);
router.get('/:id', boardMiddleWare.showPost);
router.get('/:keyStroke', boardMiddleWare.autoComplete);
router.delete('/:id', boardMiddleWare.deleteArticle);
router.delete('/:comment', boardMiddleWare.deleteComment);
router.post('/article', boardMiddleWare.insertArticle);
router.post('/article/:content', boardMiddleWare.postComment);
router.put('/:comment/:content', boardMiddleWare.editComment);
router.post('/article/:group/:content', boardMiddleWare.postReply);
router.get('/article/:id', boardMiddleWare.editArticle);
router.put('/article/:id', boardMiddleWare.submitEditedArticle);

module.exports = router;
