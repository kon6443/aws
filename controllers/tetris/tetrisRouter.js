/**
 * tetrisRouter.js
 */

const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static(__dirname + '/public'));

router.get('/', () => {
    return res.sendFile(path.join(__dirname, '../../views/Tetris/tetris.html'));
});

module.exports = router;
