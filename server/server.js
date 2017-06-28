const env = require('./env/load-environment');

const htttp = require('http');
const socketIO = require('socket.io');

const express = require('express');
const path = require('path');

const app = express();
const server = htttp.createServer(app);
const io = socketIO(server);
const publicFolder = path.join(__dirname, '../public');

env.loadEnvironment();
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.');
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to chat app.'
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined'
    });
    const createMessageListener = function createMessageListenerMethod(message) {
        console.log(`Create message: ${JSON.stringify(message, undefined, 2)}`);
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime().toString()
        // });
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
