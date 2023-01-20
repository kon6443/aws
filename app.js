// app.js

const express = require('express');
const app = express();

app.use(express.static(__dirname + ''));
app.use(express.static(__dirname + '/public'));

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

// Cookies.
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Allowing to use ejs view engine.
app.set('view engine', 'ejs');

// Routers.
const homeRouter = require('./controllers/home/homeRouter');
const game2048Router = require('./controllers/2048/2048Router');
const gameTetrisRouter = require('./controllers/tetris/tetrisRouter');
const userRouter = require('./controllers/user/userRouter');
const chatRouter = require('./controllers/chat/chatRouter');
const boardRouter = require('./controllers/board/boardRouter');
const testRouter = require('./controllers/test/testRouter');

app.use('/', homeRouter);
app.use('/2048', game2048Router);
app.use('/tetris', gameTetrisRouter);
app.use('/board', boardRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/test', testRouter);

// 404 Error Handling
app.use(function(req, res, next) {
    res.status(404).send('Sorry, cant find that!');
});

module.exports = app;
