// chatRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const chatMiddleWare = require('../controllers/chat/chat.controller');
const auth = require("../controllers/authMiddleware");

router.use('/', auth);
router.get('/', chatMiddleWare.showMain);

module.exports = router;
