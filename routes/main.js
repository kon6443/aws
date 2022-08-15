const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname, '../home.html'));
});

module.exports = router;