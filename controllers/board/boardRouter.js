// boardRouter.js

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const FilterInstance = container.get('Filter');
const BoardControllerInstance = container.get('BoardController');
const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', BoardControllerInstance.showMain);
router.get('/', BoardControllerInstance.searchArticleTitle);
router.get('/write', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.writeArticle);
router.get('/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.showArticle);
router.get('/:keyStroke', BoardControllerInstance.autoComplete);
router.delete('/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.deleteArticle);
router.delete('/:comment', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.deleteComment);
router.post('/:resourceType/:id?', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.postResource);
router.put('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.updateResource);
router.post('/article/:group/:content', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.replyComment);
router.get('/article/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.showEditingArticle);

module.exports = router;
