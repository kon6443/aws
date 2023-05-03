/**
 * Game2048Router.js
 */

const express = require("express");
const router = express.Router();

const container = require('../../models/container/container');
const Game2048ControllerInstance = container.get('Game2048Controller');

router.get('/', Game2048ControllerInstance.handleGetMain);
router.get('/:score', Game2048ControllerInstance.handleGetCheckNewRecord);
router.post('/:name/:score/:maxtile', Game2048ControllerInstance.handlePostSaveNewRecord);

module.exports = router;
