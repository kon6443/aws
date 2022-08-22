// login.controller.js

const express = require("express");
const app = express();

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');

const conn = require('../../models/boardDBController');

// Main login page.
 exports.showMain = (req, res) => {
    const user = req.decoded;
    conn.showTables();
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/board'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/board.html'));
    }
}
