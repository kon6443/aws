const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname, '../Tetris/tetris.html'));
});

module.exports = router;