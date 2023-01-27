// connectSocket.js

// SocketIO
const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const kakao = require('../../models/kakao/kakaoService');

// importing .env file
require('dotenv').config(); 

function getUserID(req) {
    if(req.cookies.user) {
        const user = jwt.verify(jwt, process.env.SECRET_KEY);
        return user.id;
    }
    console.log('1111:', req.session);
    // if(req.session.access_token !== undefined) {
    //     const {nickname, profile_image} = kakao.getUserInfo(req.session.access_token);
    //     return nickname;
    // }
}

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});
    let userDict = {};
    io
    .use((socket, next) => {
        cookieParser()(socket.request, socket.request.res || {}, next);
    })
    .on('connection', function (socket) {
        const req = socket.request;

        // const user = jwt.verify(req.cookies.user, process.env.SECRET_KEY);
        // socket.name = user.id;
        // userDict[socket.id] = socket.name;

        console.log('conconconcon:', req.session);
        // socket.name = getUserID(req);
        // userDict[socket.id] = socket.name;
        
        console.log(socket.id, ' connected: ', userDict[socket.id]);
    
        io.emit('online', userDict);
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
            delete userDict[socket.id];
            io.emit('online', userDict);
            io.emit('msg', `${socket.name} has left the chatroom.`);
        }); 
    });
}
    
