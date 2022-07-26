const express = require("express");
const app = express();
const router = express.Router();

const tetrisMiddleWare = require('../../models/tetris/tetrisService');

app.use(express.static(__dirname + '/public'));

router.get('/', tetrisMiddleWare.startGame);

module.exports = router;