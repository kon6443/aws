// server.js

const app = require('./app');

// Socket.
const connectSocket = require('./controllers/chat/connectSocket');
// MongoDB.
const { connectMongoDB } = require('./models/connectMongoDB');

const port = 80;
const server = app.listen(port, function() {
    console.log('Listening on '+port);
});

connectSocket(server);
connectMongoDB();
