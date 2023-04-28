/**
 * boardRouter.js
 */

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const FilterInstance = container.get('Filter');
const ArticleControllerInstance = container.get('ArticleController');

// '/articles'
router.get('/', ArticleControllerInstance.handleMainRequest);
// router.get('/write', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleGetArticleForm);
router.get('/auto-completion', ArticleControllerInstance.handleGetAutoComplete);
router.get('/new', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleGetWritingArticleForm);
router.get('/:id', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleGetArticle);
router.get('/:id/edit', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleGetEditingArticleForm);

// router.get('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleGetArticleForm2);

// Here resourceType is a placeholder. Depends on its value, routers handle an article or comment.
router.post('/:resourceType/:id?', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handlePostResource);
router.put('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleUpdateResource);
router.delete('/:resourceType/:id', FilterInstance.authenticationMethodDistinguisher, ArticleControllerInstance.handleDeleteResource);

module.exports = router;
