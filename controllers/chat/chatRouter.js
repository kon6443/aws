// chatRouter.js

const express = require("express");
const router = express.Router();

// Importing chat service
const chatMiddleWare = require('../../models/chat/chatService');
const auth = require("../../models/authentication/authMiddleware");

router.use('/', auth);
router.get('/', chatMiddleWare.showMain);

module.exports = router;
