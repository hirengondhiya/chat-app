const htttp = require('http');
const socketIO = require('socket.io');

const express = require('express');
const path = require('path');

const app = express();
const server = htttp.createServer(app);
const io = socketIO(server);
const publicFolder = path.join(__dirname, '../public');

const env = require('./env/load-environment');
const { generateMessage } = require('./utils/message');
env.loadEnvironment();
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    const createMessageListener = function createMessageListenerMethod(message) {
        console.log(`Create message: ${JSON.stringify(message, undefined, 2)}`);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime().toString()
        // });
    };

    const disconnectListener = function disconnectListenerMethod() {
        console.log('Disconnected from client.');
    };
    socket.on('createMessage', createMessageListener);

    socket.on('disconnect', disconnectListener);
});


server.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});
