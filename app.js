// app.js

const express = require('express');
const app = express();
const config = require('./config/config');

const session = require('express-session');
const MySQLStore = require('express-mysql-session');

app.use(express.static(__dirname + ''));
app.use(express.static(__dirname + '/public'));

const options = {
    host: config.SESSION.STORAGE_HOST,
    port: config.SESSION.STORAGE_PORT,
    user: config.SESSION.STORAGE_USER,
    password: config.SESSION.STORAGE_PASSWORD,
    database: config.SESSION.STORAGE_DB
}

app.use(session({
    // Required option, this value is for security. Ths value has to be hidden. 
    secret: config.SESSION.SECRET,
    // resave asks that if you want to save even if there is no any changes. 
    resave: false,
    /**
     * Session is not running until it is needed: true
     * Session is always running: false
     */
    saveUninitialized: true,
    store: new MySQLStore(options)
}));

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
const articleRouter = require('./controllers/articles/articleRouter');
// const testRouter = require('./controllers/test/testRouter');
const vehicleRouter = require('./controllers/vehicle/vehicleRouter');

app.use('/', homeRouter);
app.use('/2048', game2048Router);
app.use('/tetris', gameTetrisRouter);
app.use('/vehicle', vehicleRouter);
app.use('/articles', articleRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
// app.use('/test', testRouter);

// 404 Error Handling
app.use(function(req, res, next) {
    return res.status(404).send(`Sorry, can't find that!`);
});

module.exports = app;
