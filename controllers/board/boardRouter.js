// boardRouter.js

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const FilterInstance = container.get('Filter');
const BoardControllerInstance = container.get('BoardController');
const auth = require("../../models/authentication/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', BoardControllerInstance.handleMainRequest);
router.get('/write', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.displayArticleForm);
router.get('/auto-completion', BoardControllerInstance.autoComplete);
router.get('/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.getArticle);

// Here resourceType is a placeholder. Depends on its value, routers handle an article or comment.
router.delete('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.deleteResource);
router.post('/:resourceType/:id?', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.postResource);
router.put('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.updateResource);
router.get('/article/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.showEditingArticle);

module.exports = router;
