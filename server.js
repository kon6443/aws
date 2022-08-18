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

// MongoDB.
const { connectMongoDB } = require('./models/connectMongoDB');

// SocketIO
const SocketIO = require('socket.io');

// Routers.
const homeRouter = require('./routes/homeRouter');
const game2048Router = require('./routes/2048Router');
const gameTetrisRouter = require('./routes/tetrisRouter');
const loginRouter = require('./routes/loginRouter');
const chatRouter = require('./routes/chatRouter');

const port = 80;
const server = app.listen(port, function() {
    console.log('Listening on '+port+'!');
});

const io = SocketIO(server, {path: '/socket.io'});

// Connecting MongoDB.
connectMongoDB();

app.use('/', homeRouter);
app.use('/2048', game2048Router);
app.use('/tetris', gameTetrisRouter);
app.use('/login', loginRouter);
app.use('/chat', chatRouter);
