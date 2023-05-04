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

const container = require('./models/container/container');
const UserServiceInstance = container.get('userService');
const ChatServer = container.get('ChatServer');
const ChatServerInstance = new ChatServer(server, UserServiceInstance);

ChatServerInstance.connectChatServer();
// connectSocket(server);
connectMongoDB();
