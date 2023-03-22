/**
 * boardRouter.js
 */

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const FilterInstance = container.get('Filter');
const BoardControllerInstance = container.get('BoardController');

// '/board'
router.get('/', BoardControllerInstance.handleMainRequest);
router.get('/write', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handleGetArticleForm);
router.get('/auto-completion', BoardControllerInstance.handleGetAutoComplete);
router.get('/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handleGetArticle);

router.get('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handleGetArticleForm2);

// Here resourceType is a placeholder. Depends on its value, routers handle an article or comment.
router.delete('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handleDeleteResource);
router.post('/:resourceType/:id?', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handlePostResource);
router.put('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.handleUpdateResource);

router.get('/article/:id', FilterInstance.authenticationMethodDistinguisher, BoardControllerInstance.showEditingArticle);

module.exports = router;
