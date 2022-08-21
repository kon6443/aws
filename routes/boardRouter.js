// boardRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const boardMiddleWare = require('../controllers/board/board.controller');

const auth = require("../controllers/authMiddleware");
router.use('/', auth);

router.get('/', boardMiddleWare.showMain);

module.exports = router;
