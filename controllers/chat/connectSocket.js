// connectSocket.js

// SocketIO
const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// importing .env file
require('dotenv').config(); 

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});
    io
    .use((socket, next) => {
        cookieParser()(socket.request, socket.request.res || {}, next);
    })
    .on('connection', function (socket) {
        const req = socket.request;
        const decoded = jwt.verify(req.cookies.user, process.env.SECRET_KEY);
        socket.name = decoded.id;
        console.log(socket.id, ' connected: ', socket.name);
    
        // broadcasting a entering message to everyone who is in the chatroom
        io.emit('msg', `${socket.name} has entered the chatroom.`);

        // message receives
        socket.on('msg', function (data) {
            console.log(socket.name,': ', data);
            // broadcasting a message to everyone except for the sender
            socket.broadcast.emit('msg', `${socket.name}: ${data}`);
        }); 

        // user connection lost
        socket.on('disconnect', function (data) {
            io.emit('msg', `${socket.name} has left the chatroom.`);
        }); 
    });
}
    
