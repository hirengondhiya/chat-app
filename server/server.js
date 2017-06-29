const htttp = require('http');
const socketIO = require('socket.io');

const express = require('express');
const path = require('path');

const app = express();
const server = htttp.createServer(app);
const io = socketIO(server);
const publicFolder = path.join(__dirname, '../public');

const env = require('./env/load-environment');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
let users = new Users();

env.loadEnvironment();
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.');

    const createMessageListener = function createMessageListenerMethod(message, callback) {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('This is from server.');
    };

    const locationMessageListener = function locationMessageListenerMethod(location) {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));
        }
    };

    const joinListener = function joinListenerMethod(params, callback) {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room are required.');
        }
        users.addUser(socket.id, params.name, params.room);
        socket.join(params.room);
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the room ${params.room}`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));
        callback();
    };

    socket.on('join', joinListener);

    const disconnectListener = function disconnectListenerMethod() {
        const user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        console.log('Disconnected from client.');
    };
    socket.on('createMessage', createMessageListener);
    socket.on('createLocationMessage', locationMessageListener);
    socket.on('disconnect', disconnectListener);
});


server.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});
