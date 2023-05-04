/**
 * ChatServer.js
 */

const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

class ChatServer {
    constructor(server, userServiceInstance) {
        this.userServiceInstance = userServiceInstance;
        this.io = socketIo(server, {path: '/socket.io'});
        this.userDict = {};
        this.io.use((socket, next) => {
            cookieParser()(socket.request, socket.request.res || {}, next);
        });
    }

    // message receives
    handleMessage(socket, data) {
        console.log(socket.name,': ', data);
        // broadcasting a message to everyone except for the sender
        socket.broadcast.emit('msg', `${socket.name}: ${data}`);
    }

    // user connection lost
    handleDisconnection(socket) {
        delete this.userDict[socket.id];
        this.io.emit('online', this.userDict);
        this.io.emit('msg', `${socket.name} has left the chatroom.`);
    }

    async handleConnection(socket) {
        const req = socket.request;
        const user = await this.userServiceInstance.getUserInfo(req);
        socket.name = user.id;
        this.userDict[socket.id] = user.id;
        console.log(socket.id, ' connected: ', socket.name);

        this.io.emit('online', this.userDict);
        // broadcasting a entering message to everyone who is in the chatroom
        this.io.emit('msg', `${socket.name} has entered the chatroom.`);

        socket.on('msg', (data) => {
            this.handleMessage(socket, data);
        }); 

        socket.on('disconnect', (data) => {
            this.handleDisconnection(socket);
        }); 
    }

    connectChatServer() {
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        }) 
    }

}

module.exports = ChatServer;
