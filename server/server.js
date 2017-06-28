const loadEnv = require('./env/load-environment');

const htttp = require('http');
const socketIO = require('socket.io');

const express = require('express');
const path = require('path');

const app = express();
const server = htttp.createServer(app);
const io = socketIO(server);
const publicFolder = path.join(__dirname, '../public');

loadEnv();
app.use(express.static(publicFolder));

io.on('connection', (socket) => {
    console.log('New user connected.');
    const createMessageListener = function createMessageListenerMethod(message) {
        console.log(`Create message: ${JSON.stringify(message, undefined, 2)}`);
    };

    const disconnectListener = function disconnectListenerMethod() {
        console.log('Disconnected from client.');
    };

    socket.emit('newMessage', {
        from: 'Chandni Gondhiya',
        text: 'Hello Hiren',
        createdAt: new Date().getDate().toString()
    });

    socket.on('createMessage', createMessageListener);

    socket.on('disconnect', disconnectListener);
});


server.listen(process.env.PORT, () => {
    console.log(`******** Server is up on port: ${process.env.PORT} ********`);
});
