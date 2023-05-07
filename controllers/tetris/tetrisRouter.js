/**
 * tetrisRouter.js
 */

const express = require("express");
const router = express.Router();
const container = require('../../models/container/container');
const TetrisControllerInstance = container.get('TetrisController');

router.get('/', TetrisControllerInstance.handleGetMain);

module.exports = router;
