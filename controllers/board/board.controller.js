// login.controller.js

const express = require("express");
const app = express();

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

// allows you to ejs view engine.
app.set('view engine', 'ejs');
    
const dbMySQLModel = require('../../models/boardDBController');

// Main login page.
exports.showMain = async (req, res) => {
    const table = await dbMySQLModel.showTable();
    return res.render(path.join(__dirname, '../../views/board/board'), {table:table, length: table.length});
}

exports.showPost = async (req, res) => {
    const user = req.decoded;
    const article_num = req.params.id;
    let article = await dbMySQLModel.showArticleByNum(article_num);
    return res.render(path.join(__dirname, '../../views/board/article'), {user:user, article: article});
}

// Writing page.
exports.boardWrite = (req, res) => {
    const user = req.decoded;
    if(user) {
        return res.render(path.join(__dirname, '../../views/board/boardWrite'), {user:user});
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/board.html'));
    }
}

exports.postWrite = (req, res) => {
    const user = req.decoded;
    const { title, content } = req.body;
    if(user) {
        const author = user.id;
        dbMySQLModel.insert(title, content, author);
    } else {
        return res.sendFile(path.join(__dirname, '../../views/board/board.html'));
    }
}