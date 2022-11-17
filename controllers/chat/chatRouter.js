// chatRouter.js

const express = require("express");
const router = express.Router();

// Importing controller
const chatMiddleWare = require('./chat.controller');
const auth = require("../../models/authentication/authMiddleware");

router.use('/', auth);
router.get('/', chatMiddleWare.showMain);

module.exports = router;
