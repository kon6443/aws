/**
 * chatRouter.js
 */

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const ChatControllerInstance = container.get('ChatController');

// router.use('/', );
router.get('/', ChatControllerInstance.handleGetMain);
router.use(ChatControllerInstance.handleErrorHandler);

module.exports = router;
