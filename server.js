const express = require('express');
const app = express();

app.use(express.static(__dirname + ''));

// importing body-parser to create bodyParser object
const bodyParser = require('body-parser');
// allows you to use req.body var when you use http post method.
app.use(bodyParser.urlencoded({ extended: true }));

const mainRouter = require('./routes/main');
const game2048Router = require('./routes/2048');
const gameTetrisRouter = require('./routes/tetris');
const loginRouter = require('./routes/login');

const port = 80;
const server = app.listen(port, function() {
    console.log('Listening on '+port+'!');
});

app.use('/', mainRouter);
app.use('/2048', game2048Router);
app.use('/tetris', gameTetrisRouter);
app.use('/login', loginRouter);
