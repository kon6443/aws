// login.controller.js

const express = require("express");
const app = express();

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// Main login page.
 exports.showMain = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/board'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/board.html'));
    }
}

