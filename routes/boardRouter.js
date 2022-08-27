// boardRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const boardMiddleWare = require('../controllers/board/board.controller');

const auth = require("../controllers/authMiddleware");

// path: /board/
router.use('/', auth);

router.get('/', boardMiddleWare.showMain);
router.get('/write', boardMiddleWare.boardWrite);
router.get('/:id', boardMiddleWare.showPost);
router.get('/:keyStroke', boardMiddleWare.autoComplete);
router.get('/:search', boardMiddleWare.searchByTitle);
router.delete('/:id', boardMiddleWare.deleteArticle);
router.post('/article', boardMiddleWare.insertArticle);
router.get('/article/:id', boardMiddleWare.editArticle);
router.put('/article/:id', boardMiddleWare.submitEditedArticle);

module.exports = router;
