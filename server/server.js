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
env.loadEnvironment();
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.');

    const createMessageListener = function createMessageListenerMethod(message, callback) {
        console.log(`Create message: ${JSON.stringify(message, undefined, 2)}`);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server.');
    };

    const locationMessageListener = function locationMessageListenerMethod(location) {
        io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude));
    };

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));


    const disconnectListener = function disconnectListenerMethod() {
        console.log('Disconnected from client.');
    };
    socket.on('createMessage', createMessageListener);
    socket.on('createLocationMessage', locationMessageListener);
    socket.on('disconnect', disconnectListener);
});


server.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});
