/**
 * tetrisRouter.js
 */

const express = require("express");
const router = express.Router();
const container = require('../../models/container/container');
const TetrisControllerInstance = container.get('TetrisController');
// const app = express();
// app.use(express.static(__dirname + '/public'));

router.get('/', TetrisControllerInstance.handleGetMain);
// router.get('/', () => {
//     return res.sendFile(path.join(__dirname, '../../views/Tetris/tetris.html'));
// });

module.exports = router;
