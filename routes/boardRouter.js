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
router.post('/write', boardMiddleWare.postWrite);

module.exports = router;
