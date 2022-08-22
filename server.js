const express = require('express');
const app = express();

app.use(express.static(__dirname + ''));

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

// Cookies.
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// allows you to ejs view engine.
app.set('view engine', 'ejs');

// Socket.
const connectSocket = require('./controllers/chat/connectSocket');
// MongoDB.
const { connectMongoDB } = require('./models/connectMongoDB');

// Routers.
const homeRouter = require('./routes/homeRouter');
const game2048Router = require('./routes/2048Router');
const gameTetrisRouter = require('./routes/tetrisRouter');
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const boardRouter = require('./routes/boardRouter');

const port = 80;
const server = app.listen(port, function() {
    console.log('Listening on '+port);
});

connectSocket(server);
connectMongoDB();

app.use('/', homeRouter);
app.use('/2048', game2048Router);
app.use('/tetris', gameTetrisRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/board', boardRouter);
